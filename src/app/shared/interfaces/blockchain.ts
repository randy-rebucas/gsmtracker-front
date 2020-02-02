export interface Blockchain {
    timestamp: Date;
    transactions: any;
    previousHash: string;
    hash: string;
    nonce: number;
}