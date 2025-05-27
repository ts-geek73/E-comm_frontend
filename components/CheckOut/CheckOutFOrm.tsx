"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckoutFormProps, ExtendedFormValues, FormValues } from "@/types/components"
import { ShoppingBag } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import AddressForm from "./AddressForm"
import { toast, ToastContainer } from "react-toastify"
import { useUser } from "@clerk/nextjs"
import { saveAddresses } from "../function"

export default function CheckoutForm({ onSubmit, savedAddresses = [], refreshAddresses }: CheckoutFormProps) {
  const [selectedBillingId, setSelectedBillingId] = useState<string | null>(null)
  const [showNewBillingForm, setShowNewBillingForm] = useState(!savedAddresses.length)
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(null)
  const [showNewShippingForm, setShowNewShippingForm] = useState(!savedAddresses.length)
  const [sameAsBilling, setSameAsBilling] = useState(false)
  const { user } = useUser();


  useEffect(() => {
    setShowNewBillingForm(!savedAddresses.length)
    setShowNewShippingForm(!savedAddresses.length)
  }, [savedAddresses])


  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
    trigger
  } = useForm<ExtendedFormValues>()

  const billingData = watch("billing")
  const addressList = Array.isArray(savedAddresses) ? savedAddresses : [];

  useEffect(() => {
    if (sameAsBilling && billingData) {
      Object.keys(billingData).forEach((key) => {
        setValue(`shipping.${key}` as keyof ExtendedFormValues, billingData[key as keyof FormValues])
      })
    }
  }, [sameAsBilling, billingData, setValue])

  const handleAddNewAddress = async (address: FormValues, addressType: 'billing' | 'shipping') => {
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      toast.error("User email not found. Cannot save address.");
      return;
    }

    const email = user.emailAddresses[0].emailAddress;

    const newAddress = {
      ...address,
      _id: `${addressType}_${Date.now()}`,
      addressType,
    };

    const updatedAddresses = [...savedAddresses, newAddress];
    const cleanedAddresses = updatedAddresses.map(({ _id, ...rest }) => rest);


    try {
      console.log("before db :=", cleanedAddresses);

      const saved = await saveAddresses(email, cleanedAddresses);
      if (saved) {
        refreshAddresses?.();
      } else {
        toast.error("Failed to save address on server.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error saving address.");
    }

    // Select this as the active address
    if (addressType === "billing") {
      setSelectedBillingId(newAddress._id);
      setShowNewBillingForm(false);
    } else {
      setSelectedShippingId(newAddress._id);
      setShowNewShippingForm(false);
    }

    toast.success(`${addressType === "billing" ? "Billing" : "Shipping"} address saved successfully!`);
  };


  const validateAddressSelection = () => {
    let isValid = true
    let errorMessages = []

    // Validate billing address
    if (!selectedBillingId && !showNewBillingForm) {
      errorMessages.push("Please select a billing address or add a new one")
      isValid = false
    }

    // Validate shipping address (only if not same as billing)
    if (!sameAsBilling && !selectedShippingId && !showNewShippingForm) {
      errorMessages.push("Please select a shipping address or add a new one")
      isValid = false
    }

    if (!isValid) {
      errorMessages.forEach(msg => toast.error(msg))
    }

    return isValid
  }

  const handleFormSubmit = async (data: ExtendedFormValues) => {
    if (!validateAddressSelection()) {
      return
    }

    let finalBillingAddress: FormValues
    let finalShippingAddress: FormValues

    if (selectedBillingId && !showNewBillingForm) {
      const selectedAddress = savedAddresses.find(addr => addr._id === selectedBillingId)
      if (!selectedAddress) {
        toast.error("Selected billing address not found")
        return
      }
      finalBillingAddress = selectedAddress
    } else if (showNewBillingForm) {
      // Validate billing form data
      const billingValid = await trigger('billing')
      if (!billingValid) {
        toast.error("Please complete all required billing address fields")
        return
      }

      finalBillingAddress = data.billing
      handleAddNewAddress(data.billing, 'billing')
    } else {
      toast.error("Please select or add a billing address")
      return
    }

    if (sameAsBilling) {
      finalShippingAddress = finalBillingAddress
    } else if (selectedShippingId && !showNewShippingForm) {
      const selectedAddress = savedAddresses.find(addr => addr._id === selectedShippingId)
      if (!selectedAddress) {
        toast.error("Selected shipping address not found")
        return
      }
      finalShippingAddress = selectedAddress
    } else if (showNewShippingForm) {

      const shippingValid = await trigger('shipping')
      if (!shippingValid) {
        toast.error("Please complete all required shipping address fields")
        return
      }

      finalShippingAddress = data.shipping
      handleAddNewAddress(data.shipping, 'shipping')
    } else {
      toast.error("Please select or add a shipping address")
      return
    }

    // Submit the form
    onSubmit({
      billing: finalBillingAddress,
      shipping: finalShippingAddress,
      sameAsBilling
    } as ExtendedFormValues)
  }



  return (
    <Card className="border-blue-100 shadow-lg">
      <CardHeader className="bg-blue-50 rounded-t-lg border-b border-blue-100">
        <CardTitle className="text-2xl text-blue-600">Complete Your Purchase</CardTitle>
        <CardDescription>Provide your billing and shipping details to finalize your order.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Tabs defaultValue="billing" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="billing" className="flex items-center gap-2">
                Billing Address
                {!selectedBillingId && !showNewBillingForm && (
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </TabsTrigger>
              <TabsTrigger value="shipping" className="flex items-center gap-2">
                Shipping Address
                {!sameAsBilling && !selectedShippingId && !showNewShippingForm && (
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="billing" className="mt-6">
              <div className="space-y-4">

                <AddressForm
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  getValues={getValues}
                  savedAddresses={addressList}
                  selectedAddressId={selectedBillingId}
                  setSelectedAddressId={setSelectedBillingId}
                  showNewAddressForm={showNewBillingForm}
                  refreshAddresses={refreshAddresses}
                  setShowNewAddressForm={setShowNewBillingForm}
                  addressType="billing"
                  fieldPrefix="billing"
                  onAddAddress={(address) => handleAddNewAddress(address, 'billing')}
                />
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <>
                <div className="mb-4 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sameAsBilling"
                    checked={sameAsBilling}
                    onChange={() => setSameAsBilling(!sameAsBilling)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="sameAsBilling" className="text-sm font-medium text-gray-700">
                    Same as billing address
                  </label>
                </div>

                {!sameAsBilling && (
                  <>

                    <AddressForm
                      register={register}
                      errors={errors}
                      setValue={setValue}
                      getValues={getValues}
                      savedAddresses={addressList}
                      selectedAddressId={selectedShippingId}
                      setSelectedAddressId={setSelectedShippingId}
                      showNewAddressForm={showNewShippingForm}
                      setShowNewAddressForm={setShowNewShippingForm}
                      addressType="shipping"
                      fieldPrefix="shipping"
                      onAddAddress={(address) => handleAddNewAddress(address, 'shipping')}
                    />
                  </>
                )}

                {sameAsBilling && (
                  <div className="p-4 border rounded-md bg-blue-50 text-blue-800">
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <p className="text-sm">
                      Using the same address as your billing address:
                    </p>
                    <div className="mt-2 text-sm">
                      <p>{addressList.find(addr => addr._id === selectedBillingId)?.address_name || "Billing Address"}</p>
                      <p>{addressList.find(addr => addr._id === selectedBillingId)?.address}</p>
                      <p>
                        {addressList.find(addr => addr._id === selectedBillingId)?.city}, {" "}
                        {addressList.find(addr => addr._id === selectedBillingId)?.state} {" "}
                        {addressList.find(addr => addr._id === selectedBillingId)?.zip}
                      </p>
                      <p>{addressList.find(addr => addr._id === selectedBillingId)?.country}</p>
                      <p>Phone: {addressList.find(addr => addr._id === selectedBillingId)?.phone}</p>
                    </div>
                  </div>
                )}

              </>
            </TabsContent>
          </Tabs>

          <div className="mt-8 space-y-4">
            {/* Address Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Billing Address:</p>
                  <p className="text-gray-600">
                    {selectedBillingId
                      ? addressList.find(addr => addr._id === selectedBillingId)?.address_name || 'Selected Address'
                      : showNewBillingForm
                        ? 'New Address (Complete form)'
                        : 'Not Selected'
                    }
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Shipping Address:</p>
                  <p className="text-gray-600">
                    {sameAsBilling
                      ? 'Same as billing'
                      : selectedShippingId
                        ? addressList.find(addr => addr._id === selectedShippingId)?.address_name || 'Selected Address'
                        : showNewShippingForm
                          ? 'New Address (Complete form)'
                          : 'Not Selected'
                    }
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="bg-blue-600 w-full hover:bg-blue-700 text-white font-medium py-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <ShoppingBag size={18} className="mr-2" />
              Proceed with Payment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}