import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + '/blockchain';

export interface Blockchain {
  timestamp: Date;
  transactions: any;
  previousHash: string;
  hash: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private chain: Blockchain[] = [];
  private chainUpdated = new Subject<{ chain: Blockchain[] }>();

  constructor(private http: HttpClient) { }

  getChain(perPage: number, currentPage: number, providerKey: string) {
    const queryParams = `?providerKey=${providerKey}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, chains: any }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(blockchain => {
        return { chains: blockchain.chains.map(block => {
          return {
            id: block._id,
            timestamp: block.timestamp,
            transactions: block.transactions,
            previousHash: block.previousHash,
            hash: block.hash,
          };
        })};
      })
    )
    .subscribe((transformData) => {
      this.chain = transformData.chains;
      this.chainUpdated.next({
        chain: [...this.chain]
      });
    });
  }

  getChainListener() {
    return this.chainUpdated.asObservable();
  }

  getRecordTransactions(patiendPubKey: string) {
    return this.http.get<Blockchain>(BACKEND_URL + '/' + patiendPubKey);
  }

  insertTransaction(newTransaction: any) {
    return this.http.post<{ message: string, chain: Blockchain }>(BACKEND_URL, newTransaction);
  }

}
