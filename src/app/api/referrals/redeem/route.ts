import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import { 
  findReferralCodeByCode,
  findReferralByReferredIdAndCode,
  addReferral
} from '@/lib/mockData/referralStore';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { referralCode } = body;
    
    // Find the referral code
    const codeRecord = findReferralCodeByCode(referralCode);
    
    if (!codeRecord) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid referral code', 
        creditsAwarded: 0 
      });
    }
    
    if (!codeRecord.isActive) {
      return NextResponse.json({ 
        success: false, 
        message: 'Referral code is no longer active', 
        creditsAwarded: 0 
      });
    }
    
    if (codeRecord.maxUses !== null && codeRecord.usageCount >= codeRecord.maxUses) {
      return NextResponse.json({ 
        success: false, 
        message: 'Referral code has reached its maximum usage limit', 
        creditsAwarded: 0 
      });
    }
    
    // Check if user has already redeemed this code
    const existingReferral = findReferralByReferredIdAndCode(
      session.user.id, referralCode
    );
    
    if (existingReferral) {
      return NextResponse.json({ 
        success: false, 
        message: 'You have already used this referral code', 
        creditsAwarded: 0 
      });
    }
    
    // Create referral record
    const newReferral = {
      id: `ref_${Date.now()}`,
      referrerId: codeRecord.userId,
      referredId: session.user.id,
      referralCode,
      status: 'completed',
      rewardCredits: 10, // Default referral credit amount
      createdAt: new Date(),
      completedAt: new Date(),
    };
    
    addReferral(newReferral);
    
    // In a real implementation, you would award credits to both users here
    // For now, we'll just return a success response
    
    return NextResponse.json({ 
      success: true, 
      message: 'Referral code successfully redeemed!', 
      creditsAwarded: 10 
    });
  } catch (error) {
    console.error('Error redeeming referral code:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error', 
      creditsAwarded: 0 
    }, { status: 500 });
  }
}
