import { connectDB } from '@/lib/mongodb';
import Complaint from '@/models/Complaint';

export async function GET(req, { params }) {
  await connectDB();
  const { id } = await params; // <-- get it from params

  const complaint = await Complaint.findOne({ complaintId: id });
  if (!complaint) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }
  return new Response(JSON.stringify({ complaint }));
}