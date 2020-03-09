export interface Settings {
  id: string;
  userId: string;
  clinicname: string;
  rxHeaderOption: boolean;
  rxFooterOption: boolean;
  prescription: Prescription;
  appointments: boolean;
  language: string;
  updates: boolean;
  imagePath: string;
}

export interface Prescription {
  rxTitle: string;
  rxSubTitle: string;
  rxNoNoonBreak: boolean;
  rxAddresses: Address[];
  rxPhones: Phones[];
  rxHours: Hour[];
}

export interface Phones {
  contact: number;
}

export interface Address {
  address1: string;
  address2: string;
  city: string;
  province: string;
  postalCode: number;
  country: string;
}

export interface Hour {
  morningOpen: string;
  afternoonClose: string;
}

