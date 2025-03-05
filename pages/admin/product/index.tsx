import CreateProduceComp from "@/app/Components/Admin/createProduce";
import CreateCategoryComp from "@/app/Components/Admin/createCategory";
const ProductCreatePage = () => {
  

  return (
    <div className="bg-blue-200 p-5 flex min-h-screen">

    <CreateProduceComp />
    <CreateCategoryComp/>

    </div>
  );
};

export default ProductCreatePage;