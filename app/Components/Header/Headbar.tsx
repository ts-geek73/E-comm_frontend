'use client'

import Image from 'next/image'
import logo from '../../../public/e-co logo.png'
import searchImage from '../../../public/search-removebg-preview.png'
import CustomMenu from '../CustomMenu/page'
import { useState } from 'react'
import api from '@/utils/axoins';
import { useRouter } from 'next/navigation'


const HeaderComp = () => {
  let [search, setSearch] = useState<string>("")
  const router = useRouter()
  let [searchBox, setSearchBox] = useState<boolean>(false)
  const searchFun = (eve: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(eve.currentTarget.value)
    // console.log("search:",search, eve.target.value, eve.currentTarget.value);

  }

  const openSearchBox = () => {
    setSearchBox(!searchBox)
  }


  async function callApi(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    try {
      // const response = await api.get(`product/search?search=${search}`);
      // console.log(response.data);
      router.push(`/search?sc=${search}`)

    }
    catch (error: any) {
      console.log(error.response.data);

    }

  }

  return (
    <div className="bg-white shadow-md">
      <div className="flex container items-center justify-between p-6 sm:p-8 mx-auto">

        <div className="flex gap-4 items-center">
          <Image src={logo} alt="logo" height={50} width={50} className="object-contain" />
          <h1 className="text-2xl font-bold text-blue-700">Shop_Cart.com</h1>
        </div>

        <div className="flex items-center justify-between gap-6">
          {searchBox &&

            <div className="absolute flex justify-center items-center top-32 right-32 ">

              <input type="text" name="search" id="search" value={search} onChange={(e) => searchFun(e)}
                className='p-2 focus:bg-gray-200 bg-slate-200 border-2 border-solid border-black rounded-lg '
                placeholder='Search the Product' />

              <button onClick={callApi} className='pl-2 aspect-square h-10'>
                <Image src={searchImage} alt='search' height={25} width={25} onClick={openSearchBox} />
              </button>
            </div>

          }
          <Image src={searchImage} alt='search' height={20} width={20} onClick={openSearchBox} />
          <Image src={logo} alt='search' height={40} width={40} onClick={openSearchBox} />
          <CustomMenu />
        </div>
      </div>
    </div>
  )
}

export default HeaderComp
