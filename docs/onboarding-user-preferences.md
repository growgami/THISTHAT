# Onboarding User Preferences Implementation Plan

## Overview
This document outlines the implementation plan for the user onboarding process that allows users to select their preferred categories and tags, which will be stored in the MongoDB database using the UserPreference model.

## Current State Analysis

1. **Categories Data**: Well-structured `categories.json` file with multiple categories and tags for onboarding
2. **User Preference Model**: MongoDB model (`UserPreference.ts`) already implemented with the correct fields
3. **Missing Components**: 
   - No onboarding UI components
   - No logic to collect user selections
   - No integration between onboarding and preference storage
   - Empty `useUserPreferences.ts` hook

## Implementation Plan

### 1. Create Onboarding UI Components
- Build a multi-step onboarding flow in `src/features/onboarding/components/`
- Create category selection interface with visual cards
- Create tag selection interface for chosen categories
- Implement progress indicators and navigation controls

### 2. Implement User Preferences Hook
- Complete the `useUserPreferences.ts` hook to:
  - Load initial categories from `categories.json`
  - Manage user selections in local state
  - Validate selections before saving
  - Save preferences to MongoDB using the UserPreference model

### 3. Create API Route for Preference Storage
- Implement an API endpoint in `src/app/api/user-preferences/route.ts` that:
  - Accepts user preferences data
  - Validates the data structure
  - Uses the UserPreference model to store data in MongoDB
  - Returns success/failure status

### 4. Integrate with Authentication
- Ensure user ID and username are available during onboarding
- Connect onboarding flow to post-authentication flow
- Handle cases where preferences already exist

### 5. Testing and Validation
- Test end-to-end flow from onboarding to database storage
- Verify data integrity in MongoDB
- Test edge cases (no selections, partial selections, etc.)

## Technical Approach

### Data Structure
- Use the existing `categoryPreferences` and `tagPreferences` fields in your UserPreference model
- Store preferences as key-value pairs with weights (e.g., `{ "Platform Updates": 5 }`)

### UI/UX Flow
- Step 1: Category selection (multi-select with interest levels)
- Step 2: Tag selection within chosen categories
- Step 3: Review and save preferences

### Integration Points
- Connect to your existing auth system to get `user_id` and `username`
- Use the MongoDB connection functions from `UserPreference.ts`

## Data Models

### UserPreferenceDocument
```typescript
export interface UserPreferenceDocument extends Document {
  _id?: string;
  user_id: string;
  username: string;
  categoryPreferences: Record<string, number>; // Category name to preference weight
  tagPreferences: Record<string, number>; // Tag name to preference weight
  pointsAwarded: number;
  lastAwardAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Implementation Steps

1. **Frontend Components**:
   - Create onboarding UI in `src/features/onboarding/components/`
   - Implement category and tag selection interfaces
   - Add state management for user selections

2. **Backend Integration**:
   - Complete `useUserPreferences.ts` hook
   - Create API route for preference storage
   - Implement validation and error handling

3. **Database Integration**:
   - Use existing `UserPreference.ts` model functions
   - Ensure proper indexing for performance
   - Implement data consistency checks

4. **Testing**:
   - Unit tests for components and hooks
   - Integration tests for API endpoints
   - End-to-end tests for the complete flow

## Future Enhancements

- Add preference adjustment after onboarding
- Implement preference-based content recommendations
- Add analytics for preference selection patterns
- Create admin interface for category/tag management
