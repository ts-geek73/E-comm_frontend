import { AddressKey, ContactInfoFieldsProps, ExtendedFormValues } from "@/types/components";
import { Input } from "../ui/input";
import { Phone } from "lucide-react";
import { Label } from "../ui/label";
import { FieldErrors } from "react-hook-form";

export function ContactInfoFields({ register, errors, fieldPrefix, userEmail }: ContactInfoFieldsProps) {


  const currentErrors = errors[fieldPrefix as AddressKey] as FieldErrors<ExtendedFormValues>;

  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="space-y-2">
        <Label htmlFor={`${fieldPrefix}-email`} className="text-blue-800">Email Address</Label>
        <Input
          id={`${fieldPrefix}-email`}
          type="email"
          readOnly
          value={userEmail}
          placeholder="your.email@example.com"
          className="border-blue-200 focus:border-blue-500"
          {...register(`${fieldPrefix}.email` as keyof ExtendedFormValues, {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
        />
        {currentErrors?.email && (
          <span className="text-red-500 text-sm">{currentErrors?.email?.message as string}</span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${fieldPrefix}-phone`} className="text-blue-800 flex items-center">
          <Phone className="h-4 w-4 mr-1" />
          Phone Number
        </Label>
        <Input
          id={`${fieldPrefix}-phone`}
          placeholder="(123) 456-7890"
          required
          className="border-blue-200 focus:border-blue-500"
          {...register(`${fieldPrefix}.phone` as keyof ExtendedFormValues, {
            pattern: {
              value: /^(\+\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
              message: "Please enter a valid phone number"
            }
          })}
        />
        {currentErrors?.phone && (
          <span className="text-red-500 text-sm">{currentErrors?.phone?.message as string}</span>
        )}
      </div>
    </div>
  )
}