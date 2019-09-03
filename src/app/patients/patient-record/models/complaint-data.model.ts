export interface ComplaintData {
  id: string;
  created: string;
  patientId: string;
  complaints: Complaints[];
}

export interface Complaints {
  complaint: string;
}
