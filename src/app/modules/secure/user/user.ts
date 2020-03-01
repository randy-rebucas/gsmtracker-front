export interface User {
  id: string;
  name: Name;
  gender: string;
  birthdate: string;
  contact: string;
  createdAt: Date;
  updatedAt: Date;
  addresses: Address[];
  age: number;
  publicKey: string;
  privateKey: string;
  avatar?: string;
  // setting?: Settings[];
}

export interface Address {
  current: boolean;
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

// export interface Settings {
//   general: General;
// }

// export interface General {
//   name: string;
//   owner: string;
//   addresses: Address[];
//   email: string;
//   nobreak: boolean;
//   phones: Phone[];
//   hours: Hour[];
// }

// export interface Phone {
//   phones: string;
// }

// export interface Hour {
//   hours: string;
// }
