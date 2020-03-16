export interface Blockchain {
  _id: string;
  timestamp: Date;
  transactions: Transaction;
  previousHash: string;
  hash: string;
  nonce: number;
  hasAccess?: boolean;
  status?: string;
  physicianId?: string;
}

export interface Transaction {
  fromAddress: string;
  toAddress: string;
  data: any;
}
