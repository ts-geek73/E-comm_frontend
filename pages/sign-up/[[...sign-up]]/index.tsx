'use client'
import { useSignUp } from '@clerk/nextjs';

export default function Page() {
  const { isLoaded, signUp } = useSignUp()
  console.log(signUp , isLoaded);
  

  return (
    <>
    <h2>GUIghfkJUYf</h2>
    {/* {signUp} */}
    </>
  )
}