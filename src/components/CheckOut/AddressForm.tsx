import { useUser } from "@clerk/nextjs";
import { AddressFormProps, ExtendedFormValues, FormValues } from "@types";
import { NewAddressForm } from "./NewAddressForm";
import { SavedAddressList } from "./SavedAddressList";

export default function AddressForm({
  register,
  errors,
  setValue,
  savedAddresses = [],
  selectedAddressId,
  setSelectedAddressId,
  getValues,
  showNewAddressForm,
  setShowNewAddressForm,
  addressType,
  onAddAddress,
  fieldPrefix,
  refreshAddresses,
}: AddressFormProps & { getValues: () => FormValues }) {
  const { user } = useUser();

  const handleAddNewAddress = () => {
    setShowNewAddressForm(true);
  };

  const handleCancelNewAddress = () => {
    setShowNewAddressForm(false);
  };
  const addressList = Array.isArray(savedAddresses) ? savedAddresses : [];

  return (
    <div className="space-y-6">
      {addressList.length > 0 && !showNewAddressForm && (
        <>
          <SavedAddressList
            savedAddresses={addressList}
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
            addressType={addressType}
            onAddNewAddress={handleAddNewAddress}
            userEmail={user?.emailAddresses[0].emailAddress as string}
            refreshAddresses={refreshAddresses!}
          />

          {showNewAddressForm && (
            <div className="flex items-center mt-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="px-3 text-sm text-gray-500">
                Enter new address details
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
          )}
        </>
      )}

      {(addressList.length === 0 || showNewAddressForm) && (
        <NewAddressForm
          register={register}
          setValue={setValue}
          errors={errors}
          fieldPrefix={fieldPrefix}
          userEmail={user?.emailAddresses[0].emailAddress}
          onCancel={handleCancelNewAddress}
          formValues={getValues() as ExtendedFormValues}
          onSave={(values) => onAddAddress?.(values)}
        />
      )}
    </div>
  );
}
