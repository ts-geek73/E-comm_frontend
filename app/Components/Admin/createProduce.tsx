'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import api from '../../../utils/axoins';

const createProduceComp: React.FC = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            category: '',
            imageUrl: '',
            stock: 0,
        },
        mode: 'onSubmit',
    });

    const onSubmit = async (values: any) => {
        setIsLoading(true);
        try {
            const response = await api.post('/product/create', values);

            if (response.status === 200) {
                toast.success('Product created successfully!');
                toast('Rediect to Product List !');
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            } else {
                toast.success('Error ,Fail submit!');
            }
        } catch (error: any) {

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className=" max-w-2xl m-auto bg-white border-2 p-4">
                <h1 className="text-2xl font-bold mb-6">Create Product</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <div className="flex gap-5 ">
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
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <div className="flex items-center w-3/4 space-x-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                type="button"
                                                onClick={() => {
                                                    if (field.value - 50 >= 0) {
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

                            <FormField
                                control={form.control}
                                name="stock"
                                rules={{
                                    required: 'Price is required',
                                    min: {
                                        value: 0,
                                        message: 'Price must be greater than 0',
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock</FormLabel>
                                        <div className="flex items-center w-3/4  space-x-2">
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
                                                    placeholder="0.00"
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

                        </div>

                        <FormField
                            control={form.control}
                            name="category"
                            rules={{ required: 'Category is required' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="electronics">Electronics</SelectItem>
                                            <SelectItem value="clothing">Clothing</SelectItem>
                                            <SelectItem value="gaming">Gaming</SelectItem>
                                            <SelectItem value="accessories">Accessories</SelectItem>
                                            <SelectItem value="sports">Sports & Outdoors</SelectItem>
                                            <SelectItem value="home">Home & Kitchen</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
}

export default createProduceComp;