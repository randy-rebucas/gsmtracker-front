export interface Settings {
  _id: string;
  userId: string;
  name: string;
  owner: string;
  email: string;
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

export interface Subscription {
  settingId: string;
  general: any;
  notification: any;
  subscription: string;
}
