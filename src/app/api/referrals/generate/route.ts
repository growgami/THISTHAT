import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import { 
  connectToReferralsDatabase,
  findReferralCodeByUserId,
  createReferralCode
} from '@/models/Referrals';

// Generate a random referral code
function generateReferralCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Session in generate route:', session);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Connect to MongoDB
    await connectToReferralsDatabase();
    
    await request.json(); // Consume the request body but don't use it
    
    console.log('Looking for existing code for user ID:', session.user.id);
    
    // Check if user already has a referral code
    const existingCode = await findReferralCodeByUserId(session.user.id);
    
    console.log('Existing code found:', existingCode);
    
    if (existingCode) {
      return NextResponse.json({
        id: existingCode.userId,
        userId: existingCode.userId,
        code: existingCode.code,
        usageCount: existingCode.usageCount,
        createdAt: existingCode.createdAt,
      });
    }
    
    // Generate a new referral code
    const newCode = generateReferralCode();
    
    console.log('Generated new code:', newCode);
    
    // Create referral code object
    const referralCode = {
      id: `refcode_${Date.now()}`,
      userId: session.user.id,
      code: newCode,
      usageCount: 0,
      createdAt: new Date(),
    };
    
    // Save to MongoDB
    await createReferralCode(referralCode);
    
    console.log('Saved referral code:', referralCode);
    
    return NextResponse.json({
      id: referralCode.userId,
      userId: referralCode.userId,
      code: referralCode.code,
      usageCount: referralCode.usageCount,
      createdAt: referralCode.createdAt,
    });
  } catch (error) {
    console.error('Error generating referral code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
