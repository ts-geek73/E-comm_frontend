import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    //   console.log("Api call with body:=");
    const body = await req.json();
    
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    // Verify token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 400 });
    }

    // console.log("PayLoad:=",payload);
    

    const user = {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    // console.log('Verified user:', user);

    return NextResponse.json({
      success: true,
      user,
      message: 'Authentication successful',
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ error: 'Invalid token or verification failed' }, { status: 400 });
  }
}
