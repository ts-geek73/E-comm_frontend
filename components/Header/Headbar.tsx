'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import CustomMenu from '../CustomMenu/page'
import Link from 'next/link'


const HeaderComp = () => {
  const [search, setSearch] = useState<string>("")
  const router = useRouter()

  const [searchBox, setSearchBox] = useState<boolean>(false)



  return (
    <div className="bg-white  shadow-md">
      <div className="flex container items-center justify-between p-6 sm:p-8 mx-auto">

        <div className="flex gap-4 items-center">
        <Link href="/" className="flex items-center">
          <Image src={"/e-co logo.png"} alt="logo" height={50} width={50} className="object-contain" />
          </Link>
          <h1 className="text-2xl font-bold text-blue-700">Shop_Cart.com</h1>
        </div>

        <div className="flex gap-4 items-center">
          <a href="/products" className="flex items-center">
          <h1 className="text-xl ">Products</h1>
          </a>
          <a href="/cart" className="flex items-center">
          <h1 className="text-xl ">Cart</h1>
          </a>
        </div>


        <div className="flex items-center justify-between gap-6">
          {searchBox && (
            <div className="absolute flex justify-center items-center top-28 right-40 transition-all duration-300 ease-in-out transform">
              <div className="flex items-center bg-white border-2 border-solid border-gray-300 rounded-lg shadow-lg overflow-hidden w-full max-w-lg">
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={search}
                  onChange={(e) => setSearch(e.currentTarget.value)}
                  className="p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-100 bg-slate-200 border-none rounded-l-lg placeholder-gray-500 text-gray-800"
                  placeholder="Search for a product..."
                />
                <button
                  onClick={()=>       router.push(`/search?sc=${search}`)}
                  className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors duration-300 rounded-r-lg focus:outline-none"
                  aria-label="Search"
                >
                  <Image
                    src={"/search-removebg-preview.png"}
                    alt="search"
                    height={20}
                    width={20}
                    className="text-white"
                  />
                </button>
              </div>
            </div>
          )}

          <Image src={"/search-removebg-preview.png"} alt='search' height={20} width={20} onClick={()=> setSearchBox(!searchBox)} />
          {/* <Image src={"/e-co logo.png"} alt='search' height={40} width={40} /> */}
          <CustomMenu />
        </div>
      </div>
    </div>
  )
}

export default HeaderComp
