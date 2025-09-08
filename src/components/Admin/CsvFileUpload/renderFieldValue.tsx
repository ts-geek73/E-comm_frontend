import { RowData } from "./page";

export const renderFieldValue = (value: RowData[keyof RowData]) => {
  if (value === null || value === undefined || value === "") {
    return <span className="text-gray-400 italic">N/A</span>;
  }
  if (typeof value === "number") {
    return <span className="font-mono">{value.toLocaleString()}</span>;
  }
  if (typeof value === "string" && value.startsWith("http")) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline truncate block max-w-[200px]"
        title={value}
      >
        {value.length > 30 ? `${value.substring(0, 30)}...` : value}
      </a>
    );
  }
  return <span>{String(value)}</span>;
};

export const renderDataTable = (tableData: RowData[], title: string) => {
  if (tableData.length === 0) return null;

  const availableFields = Object.keys(tableData[0]);
  const fieldsToShow = expectedFields.filter((field) =>
    availableFields.includes(field)
  );
  const otherFields = availableFields.filter(
    (field) => !expectedFields.includes(field)
  );
  const allFieldsToShow = [...fieldsToShow, ...otherFields];

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {tableData.length} records
        </span>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-auto max-h-[400px]">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="border-b px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                {allFieldsToShow.map((key) => (
                  <th
                    key={key}
                    className="border-b px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {getFieldDisplayName(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500 font-medium">
                    {index + 1}
                  </td>
                  {allFieldsToShow.map((field, i) => (
                    <td
                      key={i}
                      className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                    >
                      {renderFieldValue(row[field])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const getFieldDisplayName = (field: string) => {
  const displayNames: { [key: string]: string } = {
    brand: "Brand",
    model: "Model",
    top_speed_kmh: "Top Speed (km/h)",
    battery_capacity_kWh: "Battery (kWh)",
    battery_type: "Battery Type",
    number_of_cells: "Cells",
    torque_nm: "Torque (Nm)",
    efficiency_wh_per_km: "Efficiency (Wh/km)",
    range_km: "Range (km)",
    acceleration_0_100_s: "0-100 km/h (s)",
    fast_charging_power_kw_dc: "Fast Charge (kW)",
    fast_charge_port: "Charge Port",
    towing_capacity_kg: "Towing (kg)",
    cargo_volume_l: "Cargo (L)",
    seats: "Seats",
    drivetrain: "Drivetrain",
    segment: "Segment",
    length_mm: "Length (mm)",
    width_mm: "Width (mm)",
    height_mm: "Height (mm)",
    car_body_type: "Body Type",
    source_url: "Source",
  };
  return displayNames[field] || field;
};

export const expectedFields = [
  "brand",
  "model",
  "top_speed_kmh",
  "battery_capacity_kWh",
  "battery_type",
  "number_of_cells",
  "torque_nm",
  "efficiency_wh_per_km",
  "range_km",
  "acceleration_0_100_s",
  "fast_charging_power_kw_dc",
  "fast_charge_port",
  "towing_capacity_kg",
  "cargo_volume_l",
  "seats",
  "drivetrain",
  "segment",
  "length_mm",
  "width_mm",
  "height_mm",
  "car_body_type",
  "source_url",
];
