import { SavedAddress, SavedAddressListProps } from "@types";
import { MapPin, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteAddress } from "../Functions/cart-address";
import ConfirmDelete from "../Header/ConfirmDelete";
import { Button } from "../ui/button";
import { SavedAddressCard } from "./SavedAddressCard";

export function SavedAddressList({
  savedAddresses,
  selectedAddressId,
  setSelectedAddressId,
  addressType,
  onAddNewAddress,
  userEmail,
  refreshAddresses,
}: SavedAddressListProps & {
  userEmail: string;
  refreshAddresses: () => Promise<void>;
}) {
  const [addressToDelete, setAddressToDelete] = useState<SavedAddress | null>(
    null
  );

  const handleDeleteConfirm = async () => {
    if (!userEmail || !addressToDelete) return;

    try {
      const message = await deleteAddress(userEmail, addressToDelete);
      toast.success(message);
      setAddressToDelete(null);
      await refreshAddresses(); // refetch updated list
    } catch (error) {
      console.log("fail to delete", error);
      toast.error("Failed to delete address");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-blue-700 mb-4 flex items-center">
        <MapPin className="h-5 w-5 mr-2" />
        Saved {addressType === "billing" ? "Billing" : "Shipping"} Addresses
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {savedAddresses.map((address: SavedAddress) => (
          <div key={address._id} className="relative">
            <SavedAddressCard
              address={address}
              isSelected={selectedAddressId === address._id}
              onSelect={setSelectedAddressId}
            />
            <ConfirmDelete
              title="Confirm Delete"
              description={`Are you sure you want to delete address "${address.address_name}"?`}
              onConfirm={handleDeleteConfirm}
              trigger={
                <button
                  onClick={() => setAddressToDelete(address)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"
                >
                  <Trash2 size={18} />
                </button>
              }
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Button
          type="button"
          variant="outline"
          className="text-blue-600 border-blue-300 hover:bg-blue-50"
          onClick={onAddNewAddress}
        >
          + Add New {addressType === "billing" ? "Billing" : "Shipping"} Address
        </Button>
      </div>
    </div>
  );
}
