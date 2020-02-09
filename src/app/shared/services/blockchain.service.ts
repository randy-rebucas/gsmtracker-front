import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Blockchain } from '../interfaces/blockchain';


const BACKEND_URL = environment.apiUrl + '/blockchain';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private chain: Blockchain[] = [];
  private chainUpdated = new Subject<Blockchain[]>();

  constructor(private http: HttpClient) { }

  getChain(perPage: number, currentPage: number) {
    const queryParams = `?pagesize=${perPage}&page=${currentPage}`;
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
      this.chainUpdated.next([...this.chain]);
    });
  }

  getChainListener() {
    return this.chainUpdated.asObservable();
  }

  get(blockId: string) {
    return this.http.get<any>(BACKEND_URL + '/' + blockId);
  }

  getByUser(privateKey: string): Observable<Blockchain[]> {
    return this.http.get<Blockchain[]>(BACKEND_URL + '/user/' + privateKey);
  }

  insert(newTransaction: any) {
    return this.http.post<{ message: string, chain: Blockchain }>(BACKEND_URL, newTransaction);
  }

}
