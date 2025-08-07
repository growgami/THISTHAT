import { NextResponse } from 'next/server';
import { findReferralCodeByCode } from '@/lib/mockData/referralStore';

export async function GET(request: Request) {
  try {
    
    // Note: This endpoint doesn't require authentication as it's used for validating
    // referral codes from potential new users
    
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json({ isValid: false, message: 'No referral code provided' });
    }
    
    // Find the referral code
    const codeRecord = findReferralCodeByCode(code);
    
    if (!codeRecord) {
      return NextResponse.json({ isValid: false, message: 'Invalid referral code' });
    }
    
    if (!codeRecord.isActive) {
      return NextResponse.json({ isValid: false, message: 'Referral code is no longer active' });
    }
    
    if (codeRecord.maxUses !== null && codeRecord.usageCount >= codeRecord.maxUses) {
      return NextResponse.json({ isValid: false, message: 'Referral code has reached its maximum usage limit' });
    }
    
    return NextResponse.json({ 
      isValid: true, 
      message: 'Valid referral code',
      referrerId: codeRecord.userId
    });
  } catch (error) {
    console.error('Error validating referral code:', error);
    return NextResponse.json({ 
      isValid: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
