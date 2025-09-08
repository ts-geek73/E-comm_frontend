"use client";

import React from "react";
import { toast } from "react-toastify";
import { ProductForm } from ".";

const CreateProduceComp: React.FC = () => {
  return (
    <>
      <ProductForm
        onSuccess={() => toast.success("Product created successfully")}
        formTitle="Create Product"
        formSubtitle="Fill in the details to add a new product to your inventory"
        purpose="Create"
        isEdit={false}
      />
    </>
  );
};

export default CreateProduceComp;
