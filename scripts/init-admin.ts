import 'dotenv/config';
import dbConnect from '../lib/db/mongodb';
import { ensureAdminUser } from '../lib/db/initializeAdmin';

(async () => {
  try {
    await dbConnect();
    await ensureAdminUser();
    console.info('Admin initialization completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize admin user', error);
    process.exit(1);
  }
})();
