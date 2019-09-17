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
  addresses: Address[];
}

export interface Address {
  maintenableFlg: boolean;
  medicine: string;
  preparation: string;
  sig: string;
  quantity: number;
}
