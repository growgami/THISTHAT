import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import { findReferralCodeByUserId } from '@/lib/mockData/referralStore';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Session in code route:', session);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('Looking for referral code for user ID:', session.user.id);
    
    // Find existing referral code for user
    const userReferralCode = findReferralCodeByUserId(session.user.id);
    
    console.log('Found referral code:', userReferralCode);
    
    if (!userReferralCode) {
      return NextResponse.json({ error: 'Referral code not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      id: userReferralCode.userId,
      userId: userReferralCode.userId,
      code: userReferralCode.code,
      isActive: userReferralCode.isActive,
      usageCount: userReferralCode.usageCount,
      maxUses: userReferralCode.maxUses,
      createdAt: userReferralCode.createdAt,
    });
  } catch (error) {
    console.error('Error fetching referral code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
