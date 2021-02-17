

export interface Labels {
  label: string;
}

export interface Owners {
  ownerId: string;
}

export interface Repairs {
  id: string;
  owners: Owners[];
  customer: string;
  phoneInfo: {
    brand: string;
    model: string;
    serialNumber: string,
    others: string
  };
  labels: Labels[];
  complaint: string;
  technician: string;
  actionTaken: string;
  amountPaid: number;
  warranty: string;
  release?: string;
  status?: string;
  deleted?: string;
}
