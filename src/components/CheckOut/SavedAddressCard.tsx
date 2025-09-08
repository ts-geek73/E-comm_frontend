import { SavedAddressCardProps } from "@types";

export function SavedAddressCard({
  address,
  isSelected,
  onSelect,
}: SavedAddressCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 relative cursor-pointer transition-all 
        ${
          isSelected
            ? "border-blue-500 bg-blue-50 shadow-md"
            : "border-gray-200 hover:border-blue-300"
        } 
        flex flex-col justify-between min-h-[220px] mx-auto`}
      onClick={() => {
        if (address._id) {
          onSelect(address._id);
        }
      }}
    >
      <div className="flex justify-between items-start">
        <div className="">
          <div className="text-md text-blue-700 mt-2">
            {address.address_name}
          </div>
          <div className="text-sm mt-2">{address.address}</div>
          <div className="text-sm">
            {address.city}, {address.state} {address.zip}
          </div>
          <div className="text-sm">{address.country}</div>
          <div className="text-sm text-gray-600 mt-2">{address.phone}</div>
        </div>
      </div>
    </div>
  );
}
