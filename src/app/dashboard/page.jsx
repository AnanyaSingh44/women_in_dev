import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI ;

const DashboardPage = async () => {
  // DO NOT use await or destructure with headers()
  const session = await auth.api.getSession({ headers: await headers() });


  if (!session) {
    redirect('/auth/signIn');
  }

  let userRole = session.user?.role;

  // If role is missing, fetch from DB using email
  if (!userRole && session.user?.email) {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db();
    const users = db.collection('user');
    const dbUser = await users.findOne({ email: session.user.email });
    userRole = dbUser?.role;
    await client.close();
  }

  if (userRole === "OFFICER") {
    redirect('/dashboard/officer');
  }

  return (
    <div>
      <DashboardClient user={session.user} />
    </div>
  );
};

export default DashboardPage;