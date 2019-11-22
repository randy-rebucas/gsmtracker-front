export interface Settings {
  id: string;
  userId: string;
  clinicName: string;
  clinicOwner: string;
  clinicEmail: string;
  clinicUrl: string;
  prc: string;
  ptr: string;
  s2: string;
  nobreak: boolean;
  addresses: Address[];
  clinicPhone: Contact[];
  clinicHours: Hour[];
  imagePath: string;
}

export interface Address {
address1: string;
address2: string;
city: string;
province: string;
postalCode: number;
country: string;
}

export interface Contact {
  contact: string;
}

export interface Hour {
  morningOpen: string;
  morningClose: string;
  afternoonOpen: string;
  afternoonClose: string;
}
