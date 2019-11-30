export interface User {
  id: string;
  firstname: string;
  midlename: string;
  lastname: string;
  gender: string;
  birthdate: string;
  contact: string;
  createdAt: Date;
  updatedAt: Date;
  address: Address[];
  metas: Meta[];

  isOwned: boolean;
  age: number;
  publicKey: string;
  privateKey: string;
  usertypes: string;
  physicians: Physicians[];
}

export interface Address {
  address1: string;
  address2: string;
  city: string;
  province: string;
  postalCode: number;
  country: string;
}

export interface Meta {
  label: string;
  value: string;
}

export interface Physicians {
  userId: string;
}
