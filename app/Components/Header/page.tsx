'use client'

import { useClerk } from '@clerk/nextjs'
import CustomMenu from '../CustomMenu/page'
import logo from '../../../public/e-co logo.png'
import Image from 'next/image'



const HeaderComp = () => {
  const { signOut, user } = useClerk()

  return (
    <div className="bg-white shadow-md">
      <div className="flex container items-center justify-between p-6 sm:p-8 mx-auto">

        <div className="flex gap-4 items-center">
          <Image src={logo} alt="logo" height={50} width={50} className="object-contain" />
          <h1 className="text-2xl font-bold text-blue-700">Shop_Cart.com</h1>
        </div>

        <div className="flex items-center w-1/4 justify-between gap-6">
          <input type="text" name="search" id="search" 
          className='p-2 focus:bg-gray-200 bg-slate-200 border-2 border-solid border-black rounded-lg '
          placeholder='Search the Product'/>
          <CustomMenu />
        </div>
      </div>
    </div>
  )
}

export default HeaderComp
