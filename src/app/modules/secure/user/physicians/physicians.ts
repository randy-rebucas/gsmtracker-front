export interface Physicians {
    userId: string;
    practices: Practices[];
    description: string;
    prc: string;
    ptr: string;
    s2: string;
    professionalFee: string;
    isVerified: boolean;
}

export interface Practices {
    practice: string;
    practiceYearExperience: number;
  }
