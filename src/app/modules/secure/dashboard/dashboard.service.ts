import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient
  ) { }

  bigChart() {

    // const queryParams = `?pagesize=${perPage}&page=${currentPage}`;
    // this.http.get<{message: string, users: any, counts: number }>(
    //   BACKEND_URL + queryParams
    // )
    // .pipe(
    //   map(userData => {
    //     return { users: userData.users.map(user => {
    //       return {
    //         id: user._id,
    //         name: user.name,
    //         contact: user.contact,
    //         gender: user.gender,
    //         birthdate: user.birthdate,
    //         address: user.address,
    //         created: user.createdAt,
    //         updated: user.updatedAt,
    //         meta: user.metas,
    //         physicians: user.physicians,
    //         privateKey: user.prikey,
    //         publicKey: user.pubkey
    //       };
    //     }), max: userData.counts};
    //   })
    // )
    // .subscribe((transformData) => {
    //   this.users = transformData.users;
    //   this.usersUpdated.next({
    //     users: [...this.users],
    //     counts: transformData.max
    //   });
    // });

    return [{
      name: 'Asia',
      data: [502, 635, 809, 947, 1402, 3634, 5268]
    }, {
      name: 'Africa',
      data: [106, 107, 111, 133, 221, 767, 1766]
    }, {
      name: 'Europe',
      data: [163, 203, 276, 408, 547, 729, 628]
    }, {
      name: 'America',
      data: [18, 31, 54, 156, 339, 818, 1201]
    }, {
      name: 'Oceania',
      data: [2, 2, 2, 6, 13, 30, 46]
    }];
  }

  cards() {
    return [71, 78, 39, 66];
  }

  pieChart() {
    return [{
      name: 'Chrome',
      y: 61.41,
      sliced: true,
      selected: true
    }, {
      name: 'Internet Explorer',
      y: 11.84
    }, {
      name: 'Firefox',
      y: 10.85
    }, {
      name: 'Edge',
      y: 4.67
    }, {
      name: 'Safari',
      y: 4.18
    }, {
      name: 'Sogou Explorer',
      y: 1.64
    }, {
      name: 'Opera',
      y: 1.6
    }, {
      name: 'QQ',
      y: 1.2
    }, {
      name: 'Other',
      y: 2.61
    }];
  }
}
