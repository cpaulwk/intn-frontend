import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get('access_token');

    if (!authToken) {
      return NextResponse.json({ isAuthenticated: false, user: null });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_GOOGLE_AUTH}/session`,
      {
        headers: {
          Cookie: `access_token=${authToken.value}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Authentication check failed');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error checking authentication:', error);
    return NextResponse.json(
      {
        isAuthenticated: false,
        user: null,
        error: 'Failed to check authentication status',
      },
      { status: 500 }
    );
  }
}
