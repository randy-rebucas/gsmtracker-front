export interface UserData {
  id: string;
  bloodType: string;
  comments: string;
  personId: string;
  userId: string;

  firstname: string;
  midlename: string;
  lastname: string;
  contact: string;
  gender: string;
  birthdate: string;
  email: string;
  password: string;
  addresses: Address[];
  meta: Meta[];
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

export interface Meta {
  label: string;
  value: string;
}
