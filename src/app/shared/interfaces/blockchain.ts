export interface Blockchain {
  id: string;
    timestamp: Date;
    transactions: Transaction;
    previousHash: string;
    hash: string;
    nonce: number;
}

export interface Transaction {
  setFrom: string;
  setTo: string;
  message: string;
  records: any[];
}
