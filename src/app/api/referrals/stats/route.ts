import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import { connectToReferralsDatabase, getReferralStatsByUserId } from '@/models/Referrals';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Connect to MongoDB
    await connectToReferralsDatabase();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get referral stats for the current user
    const stats = await getReferralStatsByUserId(session.user.id);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
