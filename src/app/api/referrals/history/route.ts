import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import { connectToReferralsDatabase, getReferralHistoryByUserId } from '@/models/Referrals';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Connect to MongoDB
    await connectToReferralsDatabase();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get referrals for the current user
    const userReferrals = await getReferralHistoryByUserId(session.user.id);
    
    // Format the referrals for the response
    const formattedReferrals = userReferrals.map(ref => ({
      id: ref.id,
      // Note: In a real implementation, you would fetch user details from the database
      referredUser: { id: ref.referredId, name: 'User', email: 'user@example.com' },
      referralCode: ref.referralCode,
      // Since referrals are now always active, all referrals are considered completed
      status: 'completed',
      creditsAwarded: ref.rewardCredits,
      createdAt: ref.createdAt,
      completedAt: ref.completedAt,
    }));
    
    return NextResponse.json(formattedReferrals);
  } catch (error) {
    console.error('Error fetching referral history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
