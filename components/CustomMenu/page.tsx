'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserRound } from 'lucide-react';
import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { useCustomMenu } from './function';

const CustomMenu = () => {
  const { isLoaded, user, signOut, openUserProfile } = useCustomMenu();

  if (!isLoaded || !user?.id) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative w-8 rounded-full">
          {user?.imageUrl ? (
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.imageUrl} alt={user?.username || ' '} />
              <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                <UserRound className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-semibold leading-none">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => openUserProfile()}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/user-profile">View Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/protected">Protected Page</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/create-organization">Organization</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/help">Help</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignedOut>
            <SignInButton>Sign In</SignInButton>
          </SignedOut>
          <SignedIn>
            <Button variant="ghost" onClick={() => signOut()}>
              Sign Out
            </Button>
          </SignedIn>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomMenu;
