import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { NetworkData } from './network-data.model';

import {User, IUserResponse} from '../users/user.class';

const BACKEND_URL = environment.apiUrl + '/networks';

@Injectable({providedIn: 'root'})
export class NetworksService {
    private networks: NetworkData[] = [];
    private networksUpdated = new Subject<{ networks: NetworkData[], counts: number }>();

    constructor(
        private http: HttpClient
    ) {}

    search(filter: {name: string} = {name: ''}, page: number, requesterId: string): Observable<IUserResponse> {
        const queryParams = `?requesterId=${requesterId}&page=${page}`;
        return this.http.get<IUserResponse>(BACKEND_URL + '/mynetwork' + queryParams)
        .pipe(
          tap((response: IUserResponse) => {
            console.log(response);
            response.results = response.results
              .map(user => new User(user.id, user.name))
              .filter(user => user.name.includes(filter.name));
            return response;
          })
        );
      }

    getAll(perPage: number, currentPage: number) {
        const queryParams = `?pagesize=${perPage}&page=${currentPage}`;
        this.http.get<{message: string, networks: any, max: number }>(
          BACKEND_URL + queryParams
        )
        .pipe(
          map(networkData => {
            return { networks: networkData.networks.map(network => {
              return {
                // id: network._id,
              };
            }), max: networkData.max};
          })
        )
        .subscribe((transformData) => {
          this.networks = transformData.networks;
          this.networksUpdated.next({
            networks: [...this.networks],
            counts: transformData.max
          });
        });
    }

    getUpdateListener() {
        return this.networksUpdated.asObservable();
    }

    get(networkId: string) {
        // tslint:disable-next-line: max-line-length
        return this.http.get<{ userId: string, personId: string, firstname: any, midlename: any, lastname: string, contact: string, gender: string, birthdate: string, addresses: [], meta: [] }>(
            BACKEND_URL + '/' + networkId
        );
    }

    insert( requester: string, requestee: string) {
        const networkData = {
            requesterId: requester,
            requesteeId: requestee
        };
        return this.http.post<{ message: string, network: NetworkData }>(BACKEND_URL, networkData);
    }

      // tslint:disable-next-line:max-line-length
    update(networkId: string, requester: string, requestee: string, statusUpdate: boolean) {
        const networkData = {
          id: networkId,
          status: statusUpdate,
          requesterId: requester,
          requesteeId: requestee
        };
        return this.http.put(BACKEND_URL + '/' + networkId, networkData);
    }

    delete(networkId: string) {
        return this.http.delete(BACKEND_URL + '/' + networkId);
    }
}
