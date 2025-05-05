'use client';

import HeaderComp from "@/components/Header/Headbar";
import Carousel from "@/components/Header/Carousel";
import ProductList from "@/components/Product/ProductList";
import { ToastContainer } from "react-toastify";
import useSyncUser from '@/hooks/useSyncUser';

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
