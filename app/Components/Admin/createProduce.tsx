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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import api from '../../../utils/axoins';

interface ICategory {
    _id: string
    name: string
    parentCategory_id: string
}

const CreateProduceComp: React.FC = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);

    const form = useForm({
        defaultValues: {
            name: '',
            description: '',
            brand: '',
            features: '',
            category_id: '',
            parentCategory_id: '',
            imageUrl: '',
            price: 0,
            rating: 0,
            stock: 0,
        },
        mode: 'onSubmit',
    });



    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('category');
                setCategories(data as ICategory[]);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to fetch categories.');
            }
        };
        fetchCategories();
    }, []);

    const onSubmit = async (values: any) => {
        setIsLoading(true);
        try {
            const featuresArray = values.features.split(',').map((feature: string) => feature.trim());

            const productData = {
                ...values,
                features: featuresArray,
            };

            const response = await api.post<{ message: string }>('/product/create', productData);

            if (response.status === 200) {
                toast.success(response.data.message);
                toast('Redirecting to Product List...');
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            } else {
                toast.error('Failed to create product. Please try again.');
            }
        } catch (error: any) {
            console.error('Error creating product:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-2xl m-auto bg-white border-2 p-4">
                <h1 className="text-2xl font-bold mb-6">Create Product</h1>

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

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            rules={{ required: 'Description is required' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Product description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Price */}
                        <div className="flex gap-5">
                            <FormField
                                control={form.control}
                                name="price"
                                rules={{
                                    required: 'Price is required',
                                    min: {
                                        value: 0,
                                        message: 'Price must be greater than 0',
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem className="w-1/2">
                                        <FormLabel>Price</FormLabel>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                type="button"
                                                onClick={() => {
                                                    if (field.value - 1000 >= 0) {
                                                        field.onChange(field.value - 1000);
                                                    }
                                                }}
                                            >
                                                -
                                            </Button>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    {...field}
                                                    step="1000"
                                                />
                                            </FormControl>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                type="button"
                                                onClick={() => field.onChange(field.value + 1000)}
                                            >
                                                +
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Stock */}
                            <FormField
                                control={form.control}
                                name="stock"
                                rules={{
                                    required: 'Stock is required',
                                    min: {
                                        value: 0,
                                        message: 'Stock must be greater than 0',
                                    },

                                }}
                                render={({ field }) => (
                                    <FormItem className="w-1/2">
                                        <FormLabel>Stock</FormLabel>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                type="button"
                                                onClick={() => {
                                                    if (field.value - 50 >= 0) {
                                                        field.onChange(field.value - 50);
                                                    }
                                                }}
                                            >
                                                -
                                            </Button>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                    step="50"
                                                />
                                            </FormControl>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                type="button"
                                                onClick={() => field.onChange(field.value + 50)}
                                            >
                                                +
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Rating */}
                            <FormField
                                control={form.control}
                                name="rating"
                                rules={{
                                    required: 'Rating is required',
                                    min: {
                                        value: 0,
                                        message: 'Rating must be greater than or equal to 0',
                                    },
                                    max: {
                                        value: 5,
                                        message: 'Rating must be less than or equal to 5',
                                    }
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rating</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="0 to 5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Brands */}
                        <FormField
                            control={form.control}
                            name="brand"
                            rules={{ required: 'Brand is required' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Brand</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Product brand" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Feartures */}
                        <FormField
                            control={form.control}
                            name="features"
                            rules={{ required: 'Features are required' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Features </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Feature 1, Feature 2, Feature 3" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Category */}
                        <FormField
                            control={form.control}
                            name="category_id"
                            rules={{ required: 'Category is required' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            const selectedCategory = categories.find(cat => cat._id === value);
                                            form.setValue('category_id', selectedCategory?._id || '');
                                            form.setValue('parentCategory_id', selectedCategory?.parentCategory_id || '');
                                            field.onChange(value);
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category._id} value={category._id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        {/* Image Url */}
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/image.jpg" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-center">
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? 'Creating...' : 'Create Product'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
            <ToastContainer />
        </>
    );
};

export default CreateProduceComp;