 
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AdPrompt {
  id: string;
  productName: string;
  description: string;
  style: string;
  mood: string;
  createdAt: Date;
}

export interface GeneratedAd {
  id: string;
  imageUrl: string;
  prompt: AdPrompt;
  userId: string;
  createdAt: Date;
}
