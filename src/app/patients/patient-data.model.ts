export interface PatientData {
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
}

export interface Address {
  address1: string;
  address2: string;
  city: string;
  province: string;
  postalCode: number;
  country: string;
}
