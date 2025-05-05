'use client';

import Carousel from "@/components/Header/Carousel";
import ProductList from "@/components/Product/ProductList";
import useSyncUser from '@/hooks/useSyncUser';
import { ToastContainer } from "react-toastify";

export default function Home() {
  useSyncUser(); 
  return (
<>
<div className="bg-blue-200">
        {/* <HeaderComp /> */}
        <Carousel />
        <ProductList  />
        <ToastContainer />
      </div>
</>
  );
}
