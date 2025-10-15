import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { Admin, IAdmin } from '@/lib/db/models/Admin';

const TOKEN_COOKIE_NAME = 'admin_token';
const DEFAULT_TOKEN_TTL = '7d';

interface AdminTokenPayload {
  sub: string;
  email: string;
  name: string;
}

export function getAdminTokenCookieName() {
  return TOKEN_COOKIE_NAME;
}

export function signAdminToken(admin: IAdmin, expiresIn: string = DEFAULT_TOKEN_TTL) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }

  const payload: AdminTokenPayload = {
    sub: admin.id,
    email: admin.email,
    name: admin.name,
  };

  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }

  return jwt.verify(token, secret) as AdminTokenPayload;
}

export async function authenticateAdminRequest(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    throw new AdminAuthError('Authentication token missing');
  }

  let payload: AdminTokenPayload;

  try {
    payload = verifyAdminToken(token);
  } catch {
    throw new AdminAuthError('Invalid authentication token');
  }

  const admin = await Admin.findById(payload.sub).lean();

  if (!admin) {
    throw new AdminAuthError('Admin no longer exists');
  }

  return admin;
}

export class AdminAuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 401) {
    super(message);
    this.name = 'AdminAuthError';
    this.statusCode = statusCode;
  }
}
