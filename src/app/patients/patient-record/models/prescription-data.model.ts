export interface PrescriptionData {
  id: string;
  created: string;
  complaintId: string;
  patientId: string;
  prescriptions: Prescription[];
}

export interface Prescription {
  maintenableFlg: boolean;
  medicine: string;
  preparation: string;
  sig: string;
  quantity: number;
}
