"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  CreateProduceComp,
  FileUpload,
  PromoCodeList,
  RolePermissionManager,
  StockManagement,
  ProductTable as UpdateProduceComp,
} from "@components/Admin";

const ProductCreatePage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [activeComponent, setActiveComponent] = useState<string>();

  const sidebarItems = useMemo(
    () => [
      { key: "updateProduce", label: "Product List" },
      { key: "rolePermission", label: "Role Permission Manager" },
      { key: "createProduce", label: "Create Product" },
      { key: "fileUpload", label: "File Uploading" },
      { key: "promoCodeList", label: "Promo Code" },
      { key: "stockEntry", label: "Stock Entry" },
    ],
    []
  );

  const handleSidebarClick = (key: string) => {
    setActiveComponent(key);
    router.push(`${pathname}#${key}`);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      const validKeys = sidebarItems.map((item) => item.key);
      if (hash && validKeys.includes(hash)) {
        setActiveComponent(hash);
      } else {
        setActiveComponent("updateProduce");
      }
    }
  }, [sidebarItems]);

  return (
    <div className="bg-gray-100 grid grid-cols-[1fr_6fr] border">
      <div className="bg-white p-4 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Admin Panel
        </h2>
        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleSidebarClick(item.key)}
              className={`block w-full text-left p-3 rounded-md transition-colors duration-200 ${
                activeComponent === item.key
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg min-h-[87vh] bg-white">
        {activeComponent === "updateProduce" && <UpdateProduceComp />}
        {activeComponent === "rolePermission" && <RolePermissionManager />}
        {activeComponent === "createProduce" && <CreateProduceComp />}
        {activeComponent === "fileUpload" && <FileUpload />}
        {activeComponent === "promoCodeList" && <PromoCodeList />}
        {activeComponent === "stockEntry" && <StockManagement />}
      </div>
    </div>
  );
};

export default ProductCreatePage;
