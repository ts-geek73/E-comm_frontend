"use client"

import CreateProduceComp from "@/components/Admin/createProduce";
import UpdateProduceComp from "@/components/Admin/updateProduct/page";
import PromoCodeList from "@/components/Admin/PromoCodeList";
import { useState } from "react";

const ProductCreatePage = () => {
  const [activeComponent, setActiveComponent] = useState("updateProduce");

  const handleSidebarClick = (component: string) => {
    setActiveComponent(component);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <aside className="w-64 bg-white  p-4 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Admin Panel</h2>
        <nav className="space-y-2">

        <button
            onClick={() => handleSidebarClick("updateProduce")}
            className={`block w-full text-left p-3 rounded-md transition-colors duration-200 ${
              activeComponent === "updateProduce"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            Product List
          </button>


          <button
            onClick={() => handleSidebarClick("createProduce")}
            className={`block w-full text-left p-3 rounded-md transition-colors duration-200 ${
              activeComponent === "createProduce"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            Create Product
          </button>

          <button
            onClick={() => handleSidebarClick("promoCodeList")}
            className={`block w-full text-left p-3 rounded-md transition-colors duration-200 ${
              activeComponent === "promoCodeList"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            Promo Code
          </button>
        </nav>
      </aside>

      <main className="flex-1">
        <div className="bg-white rounded-lg h-screen ">
          {activeComponent === "createProduce" && <CreateProduceComp />}
          {activeComponent === "updateProduce" && <UpdateProduceComp />}
          {activeComponent === "promoCodeList" && <PromoCodeList />}
        </div>
      </main>

    </div>
  );
};

export default ProductCreatePage;