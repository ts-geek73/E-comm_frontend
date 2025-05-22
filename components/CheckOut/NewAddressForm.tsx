import { NewAddressFormProps } from "@/types/components";
import { Button } from "../ui/button";
import { AddressFields } from "./AddressFields";
import { ContactInfoFields } from "./ContactInfoFields";

export function NewAddressForm({ 
  register, 
  setValue, 
  errors, 
  fieldPrefix, 
  userEmail, 
  onCancel 
}: NewAddressFormProps) {

  console.log("NewAddressForm");
  
  return (
    <div className="space-y-4">
      <Button 
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      
      <ContactInfoFields
        register={register}
        errors={errors}
        fieldPrefix={fieldPrefix}
        userEmail={userEmail}
      />
      
      <AddressFields
        register={register}
        setValue={setValue}
        errors={errors}
        fieldPrefix={fieldPrefix}
      />
    </div>
  )
}
