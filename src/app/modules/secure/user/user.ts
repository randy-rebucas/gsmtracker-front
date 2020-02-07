export interface User {
  id: string;
  name: Name; 
  gender: string;
  birthdate: string;
  contact: string;
  createdAt: Date;
  updatedAt: Date;
  address: Address[];
  age: number;
  publicKey: string;
  privateKey: string;
}

export interface Address {
  address1: string;
  address2: string;
  city: string;
  province: string;
  postalCode: number;
  country: string;
}

export interface Name {
  firstname: string;
  midlename: string;
  lastname: string;
}
