export interface Blockchain {
  id: string;
    timestamp: Date;
    transactions: Transaction;
    previousHash: string;
    hash: string;
    nonce: number;
}

export interface Transaction {
  fromAddress: string;
  toAddress: string;
  data: any;
}
