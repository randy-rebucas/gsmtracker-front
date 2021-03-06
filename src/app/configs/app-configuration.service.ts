import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigurationService {
  title: string;
  owner: string;
  version: string;
  tag: string;
  language: string;
  currency: string;
  country: string;
  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * Application configurations
   */

  ensureInit(): Promise<any> {
    return new Promise((r, e) => {
      // mock because can't xhr local file here
      const content = {
        title: 'shop tracker',
        owner: 'shop tracker team (please change this)',
        version: '1.0.0',
        tag: '-technicians record book!',
        language: 'en',
        currency: 'PHP',
        country: 'Philippines',
        perPage: 10,
        currentPage: 1,
        pageSizeOptions: [10, 20, 40, 80, 150, 300]
      };
      Object.assign(this, content);
      r(content);
      // real code
      /*
      this.httpClient.get("./config/config.json")
        .subscribe(
        (content: AppConfiguration) => {
          Object.assign(this, content);
          r(this);
        },
        reason => e(reason));*/
    });
  }
}
