import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET() {

  //   await auth.protect();

  //   const { userId } = await auth();
  //   const msg = "Successful";

  //   return NextResponse.json({ user ,userId, msg });
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'User not found' });
  }

  const { userId, getToken } = await auth()

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const token = await getToken()

  return NextResponse.json({ token, user , userId })

}
