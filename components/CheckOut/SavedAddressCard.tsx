import { SavedAddressCardProps } from "@/types/components";
import { useUser } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";

export function SavedAddressCard({ address, isSelected, onSelect }: SavedAddressCardProps) {
  const { user } = useUser()
  const email = user?.emailAddresses[0].emailAddress;

  return (
    <div
      className={`border rounded-lg p-4 relative cursor-pointer transition-all ${isSelected
        ? 'border-blue-500 bg-blue-50 shadow-md'
        : 'border-gray-200 hover:border-blue-300'
        }`}
      onClick={() => {
        if (address._id) {
          onSelect(address._id)
        }
      }}
    >

      <div className="flex justify-between items-start">
        <div className="">
          <div className="text-md text-blue-700 mt-2">{address.address_name}</div>
          <div className="text-sm mt-2">{address.address}</div>
          <div className="text-sm">{address.city}, {address.state} {address.zip}</div>
          <div className="text-sm">{address.country}</div>
          <div className="text-sm text-gray-600 mt-2">{address.phone}</div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
