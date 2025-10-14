import bcrypt from 'bcryptjs';
import { Admin } from './models/Admin';

let initialized = false;

export async function ensureAdminUser() {
  if (initialized) {
    return;
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Administrator';

  if (!email || !password) {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD is not set. Skipping admin initialization.');
    initialized = true;
    return;
  }

  const existingAdmin = await Admin.findOne({ email });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(password, 12);
    await Admin.create({ email, password: hashedPassword, name });
    console.info(`Admin user created for ${email}`);
  }

  initialized = true;
}
