"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckoutFormProps, FormValues } from "@/types/components"
import { MapPin, Phone, ShoppingBag, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export default function CheckoutForm({ onSubmit, savedAddresses = [] }: CheckoutFormProps) {
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
        savedAddresses.find(addr => addr.isDefault)?._id || null
    )
    const [showNewAddressForm, setShowNewAddressForm] = useState(!savedAddresses.length)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<FormValues>()

    const handleFormSubmit = (data: FormValues) => {
        if (selectedAddressId && !showNewAddressForm) {
            const selectedAddress = savedAddresses.find(addr => addr._id === selectedAddressId)
            if (selectedAddress) {
                onSubmit(selectedAddress)
                return
            }
        }

        onSubmit(data)
    }

    useEffect(() => {
        if (selectedAddressId && savedAddresses.length > 0) {
            setShowNewAddressForm(false)
        }
    }, [selectedAddressId, savedAddresses.length])

    return (
        <Card className="border-blue-100 shadow-lg">
            <CardHeader className="bg-blue-50 rounded-t-lg border-b border-blue-100">
                <CardTitle className="text-2xl text-blue-600">Complete Your Purchase</CardTitle>
                <CardDescription>Provide your shipping and payment details to finalize your order.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    {
                        !showNewAddressForm && savedAddresses.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-medium text-blue-700 mb-4 flex items-center">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    Saved Addresses
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {savedAddresses.map((address) => (
                                        <div
                                            key={address._id}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedAddressId === address._id
                                                    ? 'border-blue-500 bg-blue-50 shadow-md'
                                                    : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                            onClick={() => setSelectedAddressId(address._id)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="font-medium">{address.firstName}</div>
                                                {address.isDefault && (
                                                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Default</span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">{address.email}</div>
                                            <div className="text-sm mt-2">{address.address}</div>
                                            <div className="text-sm">{address.city}, {address.state} {address.zip}</div>
                                            <div className="text-sm">{address.country}</div>
                                            <div className="text-sm text-gray-600 mt-2">{address.phone}</div>
                                        </div>
                                    ))}
                                </div>

                                {!showNewAddressForm ? (
                                    <div className="mt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                            onClick={() => setShowNewAddressForm(true)}
                                        >
                                            + Add New Address
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center mt-4">
                                        <div className="flex-grow border-t border-gray-200"></div>
                                        <span className="px-3 text-sm text-gray-500">Enter new address details</span>
                                        <div className="flex-grow border-t border-gray-200"></div>
                                    </div>
                                )}
                            </div>
                        )}

                    {  (savedAddresses.length === 0 || showNewAddressForm) && (

                        <div className="grid gap-6">
                            {/* Customer Information Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-blue-700 flex items-center">
                                    <User className="h-5 w-5 mr-2" />
                                    Customer Information
                                </h3>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-blue-800">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        className="border-blue-200 focus:border-blue-500"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                    />
                                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message as string}</span>}
                                </div>
                            </div>

                            {/* Billing Details Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-blue-700 flex items-center">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    Billing Details
                                </h3>

                                <div className="space-y-2">
                                    <Label htmlFor="first-name" className="text-blue-800">Full Name</Label>
                                    <Input
                                        id="first-name"
                                        placeholder="John Doe"
                                        className="border-blue-200 focus:border-blue-500"
                                        {...register("firstName", { required: "Name is required" })}
                                    />
                                    {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message as string}</span>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address" className="text-blue-800">Address</Label>
                                    <Input
                                        id="address"
                                        placeholder="123 Main St, Apt 4B"
                                        className="border-blue-200 focus:border-blue-500"
                                        {...register("address", { required: "Address is required" })}
                                    />
                                    {errors.address && <span className="text-red-500 text-sm">{errors.address.message as string}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city" className="text-blue-800">City</Label>
                                        <Input
                                            id="city"
                                            placeholder="Surat"
                                            className="border-blue-200 focus:border-blue-500"
                                            {...register("city", { required: "City is required" })}
                                        />
                                        {errors.city && <span className="text-red-500 text-sm">{errors.city.message as string}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state" className="text-blue-800">State</Label>
                                        <Select onValueChange={value => setValue("state", value)}>
                                            <SelectTrigger id="state" className="border-blue-200 focus:border-blue-500">
                                                <SelectValue placeholder="Select state" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="gujarat">Gujarat</SelectItem>
                                                <SelectItem value="rajastan">Rajasthan</SelectItem>
                                                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                                                <SelectItem value="delhi">Delhi</SelectItem>
                                                <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.state && <span className="text-red-500 text-sm">{errors.state.message as string}</span>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="zip" className="text-blue-800">ZIP Code</Label>
                                        <Input
                                            id="zip"
                                            placeholder="395007"
                                            className="border-blue-200 focus:border-blue-500"
                                            {...register("zip", {
                                                required: "ZIP Code is required",
                                                pattern: {
                                                    value: /^\d{5,6}(?:[-\s]\d{4})?$/,
                                                    message: "Please enter a valid ZIP code"
                                                }
                                            })}
                                        />
                                        {errors.zip && <span className="text-red-500 text-sm">{errors.zip.message as string}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country" className="text-blue-800">Country</Label>
                                        <Select onValueChange={value => setValue("country", value)} defaultValue="india">
                                            <SelectTrigger id="country" className="border-blue-200 focus:border-blue-500">
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="india">India</SelectItem>
                                                <SelectItem value="us">United States</SelectItem>
                                                <SelectItem value="ca">Canada</SelectItem>
                                                <SelectItem value="uk">United Kingdom</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.country && <span className="text-red-500 text-sm">{errors.country.message as string}</span>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-blue-800 flex items-center">
                                        <Phone className="h-4 w-4 mr-1" />
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="phone"
                                        placeholder="(123) 456-7890"
                                        className="border-blue-200 focus:border-blue-500"
                                        {...register("phone", {
                                            pattern: {
                                                value: /^(\+\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                                                message: "Please enter a valid phone number"
                                            }
                                        })}
                                    />
                                    {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message as string}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="bg-blue-600 w-full hover:bg-blue-700 text-white font-medium py-6 rounded-lg transition-colors shadow-md hover:shadow-lg mt-8"
                    >
                        <ShoppingBag size={18} className="mr-2" />
                        Complete Purchase
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}