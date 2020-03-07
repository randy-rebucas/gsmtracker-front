import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigurationService {
  title: string;
  version: string;
  tag: string;
  language: string;
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
        title: 'clinicplus',
        version: '1.0.0',
        tag: '-were doctors are in!',
        language: 'en'
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
