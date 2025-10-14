import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db/mongodb';
import { Admin } from '@/lib/db/models/Admin';
import { getAdminTokenCookieName, signAdminToken } from '@/lib/auth/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const admin = await Admin.findOne({ email }).exec();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials',
        },
        { status: 401 }
      );
    }

    const passwordMatches = await bcrypt.compare(password, admin.password);

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials',
        },
        { status: 401 }
      );
    }

    const token = signAdminToken(admin);
    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });

    response.cookies.set({
      name: getAdminTokenCookieName(),
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to authenticate',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
