import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import { findReferralCodeByUserId } from '@/lib/mockData/referralStore';
import { REFERRAL_LINK_BASE } from '@/features/referrals/constants/referralDefaults';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Find existing referral code for user
    const userReferralCode = findReferralCodeByUserId(session.user.id);
    
    if (!userReferralCode) {
      return NextResponse.json({ error: 'Referral code not found' }, { status: 404 });
    }
    
    if (!userReferralCode.isActive) {
      return NextResponse.json({ error: 'Referral code is not active' }, { status: 400 });
    }
    
    const referralLink = `${REFERRAL_LINK_BASE}?ref=${userReferralCode.code}`;
    
    return NextResponse.json({ referralLink });
  } catch (error) {
    console.error('Error generating referral link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
