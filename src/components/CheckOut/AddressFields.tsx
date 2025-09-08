import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { AddressFieldsProps, ExtendedFormValues, FormValues } from "@types";
import { FieldErrors } from "react-hook-form";

export function AddressFields({
  register,
  setValue,
  errors,
  fieldPrefix,
}: AddressFieldsProps) {
  const currentErrors = errors[fieldPrefix] as FieldErrors<FormValues>;

  return (
    <>
      <div className="space-y-2">
        <Label
          htmlFor={`${fieldPrefix}-address_name`}
          className="text-blue-800"
        >
          Address Name
        </Label>
        <Input
          id={`${fieldPrefix}-address_name`}
          placeholder="Home, Office"
          required
          className="border-blue-200 focus:border-blue-500"
          {...register(
            `${fieldPrefix}.address_name` as keyof ExtendedFormValues,
            { required: "Name is required" }
          )}
        />
        {currentErrors?.address_name && (
          <span className="text-red-500 text-sm">
            {currentErrors?.address_name?.message as string}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${fieldPrefix}-address`} className="text-blue-800">
          Address
        </Label>
        <Input
          id={`${fieldPrefix}-address`}
          placeholder="123 Main St, Apt 4B"
          required
          className="border-blue-200 focus:border-blue-500"
          {...register(`${fieldPrefix}.address` as keyof ExtendedFormValues, {
            required: "Address is required",
          })}
        />
        {currentErrors?.address && (
          <span className="text-red-500 text-sm">
            {currentErrors?.address?.message as string}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${fieldPrefix}-city`} className="text-blue-800">
            City
          </Label>
          <Input
            id={`${fieldPrefix}-city`}
            required
            placeholder="Surat"
            className="border-blue-200 focus:border-blue-500"
            {...register(`${fieldPrefix}.city` as keyof ExtendedFormValues, {
              required: "City is required",
            })}
          />
          {currentErrors?.city && (
            <span className="text-red-500 text-sm">
              {currentErrors?.city?.message as string}
            </span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${fieldPrefix}-state`} className="text-blue-800">
            State
          </Label>
          <Select
            onValueChange={(value) =>
              setValue(
                `${fieldPrefix}.state` as keyof ExtendedFormValues,
                value
              )
            }
            required
          >
            <SelectTrigger
              id={`${fieldPrefix}-state`}
              className="border-blue-200 focus:border-blue-500"
            >
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
          {currentErrors?.state && (
            <span className="text-red-500 text-sm">
              {currentErrors?.state?.message as string}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${fieldPrefix}-zip`} className="text-blue-800">
            ZIP Code
          </Label>
          <Input
            id={`${fieldPrefix}-zip`}
            required
            placeholder="395007"
            className="border-blue-200 focus:border-blue-500"
            {...register(`${fieldPrefix}.zip` as keyof ExtendedFormValues, {
              required: "ZIP Code is required",
              pattern: {
                value: /^\d{5,6}$/,
                message: "Please enter a valid ZIP code",
              },
            })}
          />
          {currentErrors?.zip && (
            <span className="text-red-500 text-sm">
              {currentErrors?.zip?.message as string}
            </span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${fieldPrefix}-country`} className="text-blue-800">
            Country
          </Label>
          <Select
            onValueChange={(value) =>
              setValue(
                `${fieldPrefix}.country` as keyof ExtendedFormValues,
                value
              )
            }
            required
          >
            <SelectTrigger
              id={`${fieldPrefix}-country`}
              className="border-blue-200 focus:border-blue-500"
            >
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="india">India</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
            </SelectContent>
          </Select>
          {currentErrors?.country && (
            <span className="text-red-500 text-sm">
              {currentErrors?.country?.message as string}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
