import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/db/clients';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    // Only handle DELETE requests
    res.status(405).end(); // Method Not Allowed
    return;
  }
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const deleteUser = await prisma.user.delete({
      where: { email: session.user?.email! },
    });
    console.log(deleteUser);
    // redirect(res, '/');
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

  // Logic to delete the user with the given ID from the database
  // ...

  // Assuming the deletion was successful
  res.status(200).json({ message: 'User deleted successfully' });
}
