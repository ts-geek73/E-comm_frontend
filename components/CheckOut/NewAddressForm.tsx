import { ExtendedFormValues, FormValues, NewAddressFormProps } from "@/types/components";
import { Button } from "../ui/button";
import { AddressFields } from "./AddressFields";
import { ContactInfoFields } from "./ContactInfoFields";

export function NewAddressForm({
  register,
  setValue, 
  errors,
  fieldPrefix,
  userEmail,
  onSave,
  onCancel,
  formValues
}: NewAddressFormProps & { formValues: ExtendedFormValues }) {
  const selectedValues = formValues?.[fieldPrefix as keyof ExtendedFormValues] as FormValues;


  return (
    <div className="space-y-4">
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

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="default"
         onClick={() => onSave(selectedValues)}

        >
          Save
        </Button>


        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}