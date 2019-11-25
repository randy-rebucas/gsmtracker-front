export interface User {
  id: string;
  firstname: string;
  midlename: string;
  lastname: string;
  gender: string;
  birthdate: string;
  contact: string;
  createdAt: Date;
  address: Address[];
  metas: Meta[];

  age: number;
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
