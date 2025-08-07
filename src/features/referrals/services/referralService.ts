import { ReferralCode, ReferralStats, ReferralHistoryItem } from '@/types/referral';

export class ReferralService {
  private baseUrl = '/api/referrals';

  async getReferralCode(): Promise<ReferralCode> {
    const response = await fetch(`${this.baseUrl}/code`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch referral code');
    }

    return response.json();
  }

  async generateReferralCode(maxUses?: number, expiresAt?: string): Promise<ReferralCode> {
    const response = await fetch(`${this.baseUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ maxUses, expiresAt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate referral code');
    }

    return response.json();
  }

  async redeemReferralCode(referralCode: string): Promise<{ success: boolean; message: string; creditsAwarded: number }> {
    const response = await fetch(`${this.baseUrl}/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ referralCode }),
    });

    if (!response.ok) {
      throw new Error('Failed to redeem referral code');
    }

    return response.json();
  }

  async getReferralHistory(): Promise<ReferralHistoryItem[]> {
    const response = await fetch(`${this.baseUrl}/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch referral history');
    }

    return response.json();
  }

  async getReferralStats(): Promise<ReferralStats> {
    const response = await fetch(`${this.baseUrl}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch referral stats');
    }

    return response.json();
  }

  async getReferralLink(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/link`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to generate referral link');
    }

    const data = await response.json();
    return data.referralLink;
  }
}

export const referralService = new ReferralService();
