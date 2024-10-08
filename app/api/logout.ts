import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/auth/google/logout`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (response.ok) {
        res.status(200).json({ success: true });
      } else {
        res.status(response.status).json({ success: false });
      }
    } catch (error) {
      console.error('Error during logout:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
