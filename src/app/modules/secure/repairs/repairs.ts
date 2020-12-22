

export interface Labels {
  label: string;
}

export interface Repairs {
  id: string;
  customers: any;
  phoneInfo: {
    brand: string;
    model: string;
    serialNumber: string,
    others: string
  };
  labels: Labels[];
  complaint: string;
  technicians: any;
  actionTaken: string;
  amountPaid: number;
  warranty: string;
  release?: string;
  status?: string;
  deleted?: string;
}
