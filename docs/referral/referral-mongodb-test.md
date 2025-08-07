# MongoDB Referral System Integration Test

## Overview
This document outlines the steps to test the MongoDB integration for the referral system.

## Prerequisites
1. MongoDB instance running and accessible
2. Environment variables set:
   - `REFERRALS_MONGODB_URI` - MongoDB connection string
   - `REFERRALS_MONGODB_COLLECTION` - Referrals collection name (default: 'referrals')
   - `REFERRALS_MONGODB_CODES_COLLECTION` - Referral codes collection name (default: 'referral_codes')

## Test Steps

### 1. Generate a Referral Code
- Call the `/api/referrals/generate` endpoint
- Verify that a new referral code is created in the MongoDB `referral_codes` collection
- Check that the code has the correct structure with all required fields

### 2. Validate a Referral Code
- Call the `/api/referrals/validate?code=[generated_code]` endpoint
- Verify that the response indicates the code is valid
- Check that the referrerId is correctly returned

### 3. Redeem a Referral Code
- Call the `/api/referrals/redeem` endpoint with the generated code
- Verify that:
  - A new referral record is created in the MongoDB `referrals` collection
  - The referral record includes the `referredBy` field
  - The usage count for the referral code is incremented
  - The referral code is deactivated if it has reached its maximum usage limit

### 4. Check Referral History
- Call the `/api/referrals/history` endpoint
- Verify that the redeemed referral appears in the history
- Check that the response includes all required fields

### 5. Check Referral Stats
- Call the `/api/referrals/stats` endpoint
- Verify that the stats are correctly calculated
- Check that pendingReferrals is 0 and completedReferrals equals totalReferrals

### 6. Get Referral Link
- Call the `/api/referrals/link` endpoint
- Verify that a valid referral link is returned

## Expected Results
All API endpoints should return successful responses and correctly interact with the MongoDB database. No errors should occur during the test process.

## Cleanup
After testing, you may want to clean up the test data from the MongoDB collections if needed.
