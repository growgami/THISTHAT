/**
 * Simple test script to verify MongoDB referral system integration
 * 
 * To run this test:
 * 1. Set the required environment variables:
 *    - REFERRALS_MONGODB_URI
 *    - REFERRALS_MONGODB_COLLECTION (optional, defaults to 'referrals')
 *    - REFERRALS_MONGODB_CODES_COLLECTION (optional, defaults to 'referral_codes')
 * 2. Run: node test-referral-mongodb.js
 */

// Import the referral model functions
const { 
  connectToReferralsDatabase, 
  createReferralCode, 
  findReferralCodeByCode, 
  updateReferralCode,
  createReferral,
  getReferralHistoryByUserId,
  getReferralStatsByUserId
} = require('../../src/models/Referrals');

async function runTest() {
  try {
    console.log('Starting MongoDB referral system test...');
    
    // Connect to MongoDB
    await connectToReferralsDatabase();
    console.log('✓ Connected to MongoDB');
    
    // Test creating a referral code
    const testCodeData = {
      id: 'test_code_1',
      userId: 'test_user_123',
      code: 'TEST1234',
      isActive: true,
      usageCount: 0,
      maxUses: 5,
      createdAt: new Date()
    };
    
    const createdCode = await createReferralCode(testCodeData);
    console.log('✓ Created referral code:', createdCode.code);
    
    // Test finding the referral code
    const foundCode = await findReferralCodeByCode('TEST1234');
    console.log('✓ Found referral code:', foundCode.code);
    
    // Test updating the referral code
    const updated = await updateReferralCode(foundCode.id, { usageCount: 1 });
    console.log('✓ Updated referral code usage count:', updated);
    
    // Test creating a referral
    const testReferralData = {
      id: 'test_referral_1',
      referrerId: 'test_user_123',
      referredId: 'test_user_456',
      referredBy: 'test_user_123',
      referralCode: 'TEST1234',
      rewardCredits: 10,
      createdAt: new Date(),
      completedAt: new Date()
    };
    
    const createdReferral = await createReferral(testReferralData);
    console.log('✓ Created referral:', createdReferral.id);
    
    // Test getting referral history
    const history = await getReferralHistoryByUserId('test_user_123');
    console.log('✓ Retrieved referral history, count:', history.length);
    
    // Test getting referral stats
    const stats = await getReferralStatsByUserId('test_user_123');
    console.log('✓ Retrieved referral stats:', stats);
    
    console.log('\nAll tests passed! MongoDB referral system integration is working correctly.');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  runTest();
}
