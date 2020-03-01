import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigurationService {
  title: string;
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
        title : 'clinicplus',
        dayTrial : 14,
        version : '1.0.0'
      };
      Object.assign(this, content);
      r(content);
      console.log('Response 1 - ', content);
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
