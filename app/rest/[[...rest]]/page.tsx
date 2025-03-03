import { SignInWithMetamaskButton, SignOutButton, SignUpButton, UserButton, UserProfile } from '@clerk/nextjs'

export default function Home() {
    return (<>
        {/* <SignInButton>
            <button>Custom sign in button</button>
        </SignInButton> */}
        <div className="bg-blue-200 min-h-screen">


            <SignInWithMetamaskButton />
            <br />
            <SignUpButton />
            <br />
            <SignOutButton />
            <br />
            <div className="flex gap-7 justify-center">
                <UserButton />
                <UserProfile />
            </div>
        </div>
    </>)
}