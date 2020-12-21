

export interface Labels {
  label: string;
}

export interface Repairs {
  id: string;
  customer: {
    name: {
      firstname: string;
      lastname: string;
    };
    phone: string;
    address: string;
  };
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
  status: string;
  deleted: string;
  release?: string;
}
