import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get('auth_token');
    console.log("authToken", authToken);

    if (!authToken) {
      return NextResponse.json({ isAuthenticated: false, user: null });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_GOOGLE_AUTH}/session`, {
      headers: {
        'Cookie': `auth_token=${authToken.value}`,
      },
    });
    console.log("response", response);

    if (!response.ok) {
      throw new Error('Authentication check failed');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error checking authentication:', error);
    return NextResponse.json(
      { isAuthenticated: false, user: null, error: 'Failed to check authentication status' },
      { status: 500 }
    );
  }
}
