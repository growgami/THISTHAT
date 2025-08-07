import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import { getReferralHistoryByUserId } from '@/lib/mockData/referralStore';
import type { Referral } from '@/lib/mockData/referralStore';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get referrals for the current user
    const userReferrals = getReferralHistoryByUserId(session.user.id);
    
    // Calculate statistics
    const totalReferrals = userReferrals.length;
    const pendingReferrals = userReferrals.filter((ref: Referral) => ref.status === 'pending').length;
    const completedReferrals = userReferrals.filter((ref: Referral) => ref.status === 'completed').length;
    const totalCreditsEarned = userReferrals
      .filter((ref: Referral) => ref.status === 'completed')
      .reduce((sum: number, ref: Referral) => sum + ref.rewardCredits, 0);
    
    return NextResponse.json({
      totalReferrals,
      pendingReferrals,
      completedReferrals,
      totalCreditsEarned,
    });
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
