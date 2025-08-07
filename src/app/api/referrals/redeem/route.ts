import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import { 
  connectToReferralsDatabase,
  findReferralCodeByCode,
  findReferralByReferredIdAndCode,
  createReferral,
  updateReferralCode
} from '@/models/Referrals';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Connect to MongoDB
    await connectToReferralsDatabase();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { referralCode } = body;
    
    // Find the referral code
    const codeRecord = await findReferralCodeByCode(referralCode);
    
    if (!codeRecord) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid referral code', 
        creditsAwarded: 0 
      });
    }
    

    
    // Check if the user has already redeemed this referral code
    const existingReferral = await findReferralByReferredIdAndCode(session.user.id, referralCode);
    
    if (existingReferral) {
      return NextResponse.json({ 
        success: false, 
        message: 'You have already redeemed this referral code', 
        creditsAwarded: 0 
      });
    }
    
    // Increment usage count for the referral code
    const updatedUsageCount = codeRecord.usageCount + 1;
    
    // Update the referral code
    await updateReferralCode(codeRecord.id, {
      usageCount: updatedUsageCount
    });
    
    // Create referral record
    const newReferral = {
      id: `ref_${Date.now()}`,
      referrerId: codeRecord.userId,
      referredId: session.user.id,
      referredBy: codeRecord.userId, // New field to track who referred the user
      referralCode,
      rewardCredits: 10, // Default referral credit amount
      createdAt: new Date(),
      completedAt: new Date(),
    };
    
    await createReferral(newReferral);
    
    // In a real implementation, you would award credits to both users here
    // For now, we'll just return a success response
    
    return NextResponse.json({
      success: true,
      message: 'Referral code redeemed successfully!',
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
