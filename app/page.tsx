'use client';

import Carousel from "@/components/Header/Carousel";
import ProductList from "@/components/Product/ProductList";
import { useSyncUser } from '@/hooks';

export default function Home() {
  try {
    
    useSyncUser(); 
  } catch (error) {
    console.log(error);
    
  }
  return (
<>
<div className="bg-blue-200 min-h-screen">
        {/* <HeaderComp /> */}
        <Carousel />
        <ProductList  />
      </div>
</>
  );
}
