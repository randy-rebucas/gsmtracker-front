export interface Settings {
  _id: string;
  userId: string;
  name: string;
  owner: string;
  email: string;
  prc: number;
  ptr: number;
  s2: number;
  nobreak: boolean;
  addresses: Address[];
  phones: Contact[];
  hours: Hour[];
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
