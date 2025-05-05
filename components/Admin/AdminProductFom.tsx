'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Check, ChevronsUpDown, Image as ImageIcon, Plus, Trash2 } from "lucide-react";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { cn } from "@/lib/utils";

import MyEditor from "@/components/Editor";
import { Textarea } from '@/components/ui/textarea';
import { FormValues, IBrand, ICategory, IImageUrl, IProductData } from "@/types/product";
import { FileUploadResponse, IResponse } from "@/types/response";
import { AxiosError } from 'axios';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import api from '../../lib/axoins';





interface ProductFormProps {
    productData?: IProductData;
    onSuccess?: (message: string) => void;
    formTitle?: string;
    formSubtitle?: string;
    purpose?: string;
    isEdit?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
    productData,
    onSuccess,
    formTitle = "Create Product",
    formSubtitle = "Fill in the details to add a new product to your inventory",
    purpose = "Create",
    isEdit = false
}) => {
    
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [brands, setBrands] = useState<IBrand[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImages, setPreviewImages] = useState<{ url: string, isNew: boolean, file?: File }[]>([]);

    // Initialize form with default or provided values
    const form = useForm<FormValues>({
        defaultValues: {
            name: productData?.name || '',
            status: productData?.status || false,
            short_description: productData?.short_description || '',
            long_description: productData?.long_description || '',
            brand: productData?.brands?.[0]?._id || '',
            category_id: productData?.categories?.map(cat => cat._id) || [],
            imageFiles: [],
            price: productData?.price || 0,
        },
        mode: 'onSubmit',
    });

    const { control, setValue, reset, } = form;

    useEffect(() => {
        const fetchCategoryAndBrand = async () => {
            try {
                const { data } = await api.get<{ categories: ICategory[], brands: IBrand[] }>('product/combos');
                setCategories(data.categories);
                setBrands(data.brands);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategoryAndBrand();
    }, []);

    useEffect(() => {
        if (productData?.images?.length) {
            const existingImages = productData.images.map(img => ({
                url: img.url,
                isNew: false
            }));
            setPreviewImages(existingImages);
        }
    }, [productData]);

    // Reset form if productData changes
    useEffect(() => {
        if (productData) {
            reset({
                name: productData.name || '',
                status: productData.status || false,
                short_description: productData.short_description || '',
                long_description: productData.long_description || '',
                brand: productData.brands?.[0]?._id || '',
                category_id: productData.categories?.map(cat => cat._id) || [],
                imageUrls: productData.images || [],
                imageFiles: [],
                price: productData.price || 0,
            });
        }
    }, [productData, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFiles: File[] = Array.from(files);
            const currentFiles = form.getValues('imageFiles') || [];

            form.setValue("imageFiles", [...currentFiles, ...newFiles]);

            const newPreviews = [...previewImages];

            for (let i = 0; i < newFiles.length; i++) {
                const file = newFiles[i];
                const reader = new FileReader();

                reader.onloadend = () => {
                    newPreviews.push({
                        url: reader.result as string,
                        isNew: true,
                        file: file
                    });
                    setPreviewImages([...newPreviews]);
                };

                reader.readAsDataURL(file);
            }
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        const updatedPreviews = [...previewImages];
        const removedImage = updatedPreviews[index];
        updatedPreviews.splice(index, 1);
        setPreviewImages(updatedPreviews);

        if (removedImage.isNew) {

            const currentFiles = form.getValues('imageFiles');
            const updatedFiles = currentFiles.filter(file =>
                file !== removedImage.file
            );
            form.setValue("imageFiles", updatedFiles);
        } else {

            const currentImageUrls = form.getValues('imageUrls');
            const updatedImageUrls = currentImageUrls.filter(() =>
                index !== currentImageUrls.findIndex(img => img.url === removedImage.url));
            form.setValue("imageUrls", updatedImageUrls);
        }
    };

    const onSubmit = async (values: FormValues) => {
        setIsLoading(true);
        try {
            

            const formData = {
                name: values.name,
                short_description: values.short_description,
                long_description: values.long_description,
                price: values.price,
                status: values.status ?? false,
                brands: [
                    {
                        name: brands.find((b) => b._id === values.brand)?.name || values.brand,
                        _id: values.brand
                    },
                ],
                categories: values.category_id.map(id => ({ _id: id })),
                imageUrls: [] as IImageUrl[],
            };

            // Keep existing images that weren't removed
            const existingImages = previewImages
                .filter(img => !img.isNew)
                .map(img => {
                    const originalImg = productData?.images?.find(original => original.url === img.url);
                    return {
                        url: img.url,
                        name: originalImg?.name || 'Product Image'
                    };
                });

            // Handle new image file uploads
            const newImageFiles = values.imageFiles;
            if (newImageFiles && newImageFiles.length > 0) {
                const uploadedImages: IImageUrl[] = [];

                for (const file of newImageFiles) {
                    const uploadFormData = new FormData();
                    uploadFormData.append("imagefile", file);

                    const response = await fetch("/api/file-upload", {
                        method: "POST",
                        body: uploadFormData,
                    });

                    const result: FileUploadResponse = await response.json();

                    if (result.status === 'success') {
                        uploadedImages.push({
                            url: result.url,
                            name: result.name,
                        });
                    } else {
                        toast.error(`Failed to upload image: ${file.name}`);
                    }
                }

                formData.imageUrls = [...existingImages, ...uploadedImages];
            } else {
                formData.imageUrls = existingImages;
            }

            // If no images at all, provide a warning
            if (formData.imageUrls.length === 0) {
                toast.warning('No product images selected. Adding product without images.');
            }

            let apiResponse;
            if (isEdit && productData?._id) {
                // Update existing product
                apiResponse = await api.put<IResponse>(`/product/update/${productData._id}`, formData);
            } else {
                // Create new product
                apiResponse = await api.post<IResponse>('/product/create', formData);
            }

            if (apiResponse.status === 200) {
                const successMessage = isEdit
                    ? 'Product updated successfully!'
                    : 'Product created successfully!';

                toast.success(apiResponse.data?.message || successMessage);

                if (onSuccess) {
                    onSuccess(successMessage);
                } else {
                    toast('Redirecting to Product List...');
                    // Reset form if no onSuccess handler
                    if (!isEdit) {
                        setPreviewImages([]);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                        reset({
                            name: '',
                            status: false,
                            short_description: '',
                            long_description: '',
                            brand: '',
                            features: '',
                            category_id: [],
                            imageUrls: [],
                            imageFiles: [],
                            price: 0,
                        });
                    }
                }
            } else {
                toast.error(`Failed to ${isEdit ? 'update' : 'create'} product. Please try again.`);
            }
        } catch (error: unknown) {
            if(error instanceof AxiosError){

                toast.error(error.response?.data?.message || 'An unexpected error occurred. Please try again.');
                console.error(`Error ${isEdit ? 'updating' : 'creating'} product:`, error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="pt-10 px-10 w-full flex justify-center">
                <div className="w-full relative bg-white border border-gray-200 shadow-xl rounded-2xl p-10">

                    <h1 className="text-3xl font-bold mb-2 text-gray-800">{formTitle}</h1>
                    <p className="text-gray-500 mb-6">{formSubtitle}</p>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                rules={{ required: 'Product name is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Product name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={control}
                                name="status"
                                rules={{ required: 'Product status is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center">
                                                <Switch
                                                    id="status-toggle"
                                                    checked={field.value}
                                                    onCheckedChange={(checked : boolean ) => setValue("status", checked)}
                                                    className="w-10 mr-2 bg-gray-200 rounded-full shadow-inner"
                                                />
                                                <span className="text-sm text-gray-500">
                                                    {field.value ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Short Description */}
                            <FormField
                                control={form.control}
                                name="short_description"
                                rules={{ required: 'Short description is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Short Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Brief product description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Long Description */}
                            <FormField
                                control={control}
                                name="long_description"
                                rules={{ required: 'Long description is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Long Description</FormLabel>
                                        <FormControl>
                                            <MyEditor {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Price */}
                            <FormField
                                control={form.control}
                                name="price"
                                rules={{
                                    required: 'Price is required',
                                    min: { value: 1, message: 'Price must be greater than 0' },
                                }}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Price</FormLabel>
                                        <div className="flex items-center gap-2 max-w-md">
                                            <Button
                                                type="button"
                                                // variant="secondary"
                                                onClick={() => field.onChange(Math.max(Number(field.value) - 1000, 0))}
                                            >
                                                –
                                            </Button>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    step="1000"
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                // variant="secondary"
                                                onClick={() => field.onChange(Number(field.value) + 1000)}
                                            >
                                                +
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Features */}
                            <FormField
                                control={form.control}
                                name="features"
                                rules={{ required: 'Features are required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Features</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Feature 1, Feature 2" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Categories */}
                            <FormField
                                control={form.control}
                                name="category_id"
                                rules={{ required: 'Select at least one category' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Categories</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        // variant="outline"
                                                        className="w-full justify-between"
                                                    >
                                                        {field.value.length > 0
                                                            ? `${field.value.length} selected`
                                                            : "Select categories"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Search categories..." />
                                                    <CommandList>
                                                        <CommandEmpty>No categories found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {categories.map((cat) => (
                                                                <CommandItem
                                                                    key={cat._id}
                                                                    value={cat._id}
                                                                    onSelect={() => {
                                                                        const selected = field.value || [];
                                                                        const newValue = selected.includes(cat._id!)
                                                                            ? selected.filter((id) => id !== cat._id)
                                                                            : [...selected, cat._id];
                                                                        field.onChange(newValue);
                                                                    }}
                                                                >
                                                                    {cat.name}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto h-4 w-4",
                                                                            field.value.includes(cat._id!)
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
                                            {field.value.map((id: string) => {
                                                const category = categories.find((cat) => cat._id === id);
                                                return category ? (
                                                    <span key={id} className="bg-gray-100 px-2 py-1 rounded">
                                                        {category.name}
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Brand */}
                            <FormField
                                control={form.control}
                                name="brand"
                                rules={{ required: 'Brand is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Brand</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        // variant="outline"
                                                        className="w-full justify-between"
                                                    >
                                                        {field.value
                                                            ? brands.find(b => b._id === field.value)?.name || "Select brand"
                                                            : "Select brand"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Search brands..." />
                                                    <CommandList>
                                                        <CommandEmpty>No brands found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {brands.map((brand) => (
                                                                <CommandItem
                                                                    key={brand._id}
                                                                    value={brand._id}
                                                                    onSelect={() => {
                                                                        field.onChange(brand._id);
                                                                    }}
                                                                >
                                                                    {brand.name}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto h-4 w-4",
                                                                            field.value === brand._id
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Images Upload */}
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel>Product Images</FormLabel>
                                    <div className="text-xs text-gray-500">
                                        {previewImages.length} {previewImages.length === 1 ? 'image' : 'images'}
                                    </div>
                                </div>

                                {/* Image Upload Button */}
                                <div className="mt-2">
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <div
                                            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-4 px-6 
                                        transition-colors hover:border-gray-400">
                                            <Plus size={20} className="mr-2 text-gray-500" />
                                            <span className="text-sm text-gray-600">Add Images</span>
                                            <Input
                                                id="image-upload"
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </div>
                                    </label>
                                </div>

                                {/* Image Gallery */}
                                {previewImages.length > 0 && (
                                    <div className="mt-4">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {previewImages.map((img, index) => (
                                                <div key={index} className="group relative rounded-lg overflow-hidden border border-gray-200">
                                                    <div className="aspect-square w-full overflow-hidden bg-gray-100">
         

                                                        <Image 
                                                            src={img.url}
                                                            alt={`Product image ${index + 1}`}
                                                            className="h-full w-full object-cover transition-all hover:scale-105"
                                                            />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 size={16} className="text-red-500" />
                                                    </button>
                                                    {/* {img.isNew && (
                                                        <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs rounded px-2 py-0.5">
                                                            New
                                                        </div>
                                                    )} */}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Empty State */}
                                {previewImages.length === 0 && (
                                    <div className="mt-4 flex flex-col items-center justify-center py-8 text-center border border-gray-200 rounded-lg">
                                        <ImageIcon size={48} className="text-gray-300 mb-2" />
                                        <p className="text-gray-500 text-sm">No images yet</p>
                                        <p className="text-gray-400 text-xs mt-1">Upload images to showcase your product</p>
                                    </div>
                                )}
                            </FormItem>

                            {/* Submit */}
                            <div className="w-full flex justify-end gap-4">
                                {isEdit && (
                                    <Button
                                        type="button"
                                        // variant="outline"
                                        onClick={() => window.location.reload()
                                        }
                                        className="px-6 py-2 text-base"
                                    >
                                        Cancel
                                    </Button>
                                )}
                                <Button disabled={isLoading} type="submit" className="px-6 py-2 text-base">
                                    {isLoading ? (isEdit ? 'Updating...' : 'Creating...') : purpose === 'Create' ? 'Create Product' : 'Update Product'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default ProductForm;