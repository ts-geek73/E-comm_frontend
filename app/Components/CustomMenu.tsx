'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useClerk, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import {
  SignedIn,
  SignedOut,
  SignInButton
} from "@clerk/nextjs"

const CustomMenu = () => {
  const { isLoaded, user } = useUser()
  const { signOut, openUserProfile } = useClerk()

  if (!isLoaded) return null
  if (!user?.id) return null

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button className="flex items-center gap-3 p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-all">
          <Image
            alt={user?.primaryEmailAddress?.emailAddress!}
            src={user?.imageUrl!}
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="font-semibold text-lg text-gray-800">
            {user?.username?.split(" ")[0]}
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          side="bottom"
          className="w-72 mt-2 bg-white rounded-lg shadow-xl ring-1 ring-gray-300 focus:outline-none"
        >
          <DropdownMenu.Group>
            <DropdownMenu.Item asChild className="px-5 py-3 text-lg text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer">
              <button onClick={() => openUserProfile()} className="w-full text-left">Profile</button>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild className="px-5 py-3 text-lg text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer">
              <a href="/user-profile" className="block">View Profile</a>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild className="px-5 py-3 text-lg text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer">
              <a href="/protected" className="block">Protected Page</a>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild className="px-5 py-3 text-lg text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer">
              <a href="/create-organization" className="block">Create Organization</a>
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-2 h-px bg-gray-200" />
            <DropdownMenu.Item asChild className="px-5 py-3 text-lg text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer">
              <a href="/help" className="block">Help</a>
            </DropdownMenu.Item>
          </DropdownMenu.Group>

          <DropdownMenu.Separator className="my-2 h-px bg-gray-200" />

          <DropdownMenu.Item className="px-5 py-3 text-lg text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer">
            <SignedOut>
              <SignInButton>
                <button className="w-full text-left text-gray-800 hover:bg-gray-100 rounded-md px-4 py-2">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <button
                onClick={() => signOut()}
                className="w-full text-left text-gray-800 hover:bg-gray-100 rounded-md px-4 py-2"
              >
                Sign Out
              </button>
            </SignedIn>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default CustomMenu
