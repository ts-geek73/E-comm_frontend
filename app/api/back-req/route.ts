import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
    // console.log("enter in api ");
  const { sessionClaims } = await auth()
//   console.log("Back Dtaa : " , sessionClaims);

  const fullName = sessionClaims?.Name

  const primaryEmail = sessionClaims?.email

  return NextResponse.json({ fullName, primaryEmail })
}