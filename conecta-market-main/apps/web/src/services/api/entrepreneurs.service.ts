const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface OnboardingPayload {
  name: string;
  email: string;
  whatsapp: string;
  categoryId: string;
}

export interface OnboardingResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const entrepreneurService = {
  async onboard(payload: OnboardingPayload): Promise<OnboardingResponse> {
    const res = await fetch(`${API_URL}/entrepreneurs/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(error.message ?? `Erro ${res.status}`);
    }

    return res.json();
  },
};
