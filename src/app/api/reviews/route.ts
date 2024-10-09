import type { NextApiRequest, NextApiResponse } from 'next';
import { insertReview } from '@/db/Reviews/operations';
import { IReviewInsert } from '@/db/Reviews/schema';

export default async function POST(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const data: IReviewInsert = req.body;
    try {
      const result = await insertReview(data);
      res.status(200).json({ success: true, review: result });
    } catch (error) {
      console.error('Error submitting review:', error);
      res.status(500).json({ success: false, error: 'Failed to submit review' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}