const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface AdminProfile {
  id: string;
  email: string;
  name: string;
}

export interface AdminAuthPayload {
  email: string;
  password: string;
}

export const loginAdmin = async (payload: AdminAuthPayload) => {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to login');
  }

  return result.data as AdminProfile;
};

export const logoutAdmin = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to logout');
  }

  return true;
};

export const getAdminProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/me`, {
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Not authenticated');
  }

  return result.data as AdminProfile;
};
