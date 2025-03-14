import { useState } from "react";
import CreateProduceComp from "@/app/Components/Admin/createProduce";
import UpdateProduceComp from "@/app/Components/Admin/updateProduct";
import CreateCategoryComp from "@/app/Components/Admin/createCategory";

const ProductCreatePage = () => {
  const [activeComponent, setActiveComponent] = useState("updateProduce");

  const handleSidebarClick = (component: string) => {
    setActiveComponent(component);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <aside className="w-64 bg-white shadow-md p-4 space-y-4">
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
            onClick={() => handleSidebarClick("createCategory")}
            className={`block w-full text-left p-3 rounded-md transition-colors duration-200 ${
              activeComponent === "createCategory"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            Create Category
          </button>
        </nav>
      </aside>

      <main className="flex-1">
        <div className="bg-white rounded-lg h-screen shadow-md">
          {activeComponent === "updateProduce" && <UpdateProduceComp />}
          {activeComponent === "createProduce" && <CreateProduceComp />}
          {activeComponent === "createCategory" && <CreateCategoryComp />}
        </div>
      </main>
    </div>
  );
};

export default ProductCreatePage;