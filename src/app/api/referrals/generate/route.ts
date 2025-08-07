import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import { 
  findReferralCodeByUserId, 
  addReferralCode 
} from '@/lib/mockData/referralStore';

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
    
    const body = await request.json();
    const { maxUses, expiresAt } = body;
    
    console.log('Looking for existing code for user ID:', session.user.id);
    
    // Check if user already has a referral code
    const existingCode = findReferralCodeByUserId(session.user.id);
    
    console.log('Existing code found:', existingCode);
    
    if (existingCode) {
      return NextResponse.json({
        id: existingCode.userId,
        userId: existingCode.userId,
        code: existingCode.code,
        isActive: existingCode.isActive,
        usageCount: existingCode.usageCount,
        maxUses: existingCode.maxUses,
        createdAt: existingCode.createdAt,
      });
    }
    
    // Generate new referral code
    const newCode = {
      userId: session.user.id,
      code: generateReferralCode(),
      isActive: true,
      usageCount: 0,
      maxUses: maxUses || null,
      createdAt: new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    };
    
    console.log('Adding new referral code:', newCode);
    
    addReferralCode(newCode);
    
    return NextResponse.json({
      id: newCode.userId,
      userId: newCode.userId,
      code: newCode.code,
      isActive: newCode.isActive,
      usageCount: newCode.usageCount,
      maxUses: newCode.maxUses,
      createdAt: newCode.createdAt,
    });
  } catch (error) {
    console.error('Error generating referral code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
