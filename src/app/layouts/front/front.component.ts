import { Component, OnInit } from '@angular/core';
import { AppConfigurationService } from 'src/app/configs/app-configuration.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.scss']
})
export class FrontComponent implements OnInit {
  config: any;

  constructor(
    private translate: TranslateService,
    private appConfigurationService: AppConfigurationService
  ) {
    translate.setDefaultLang(appConfigurationService.language); // default language
    // this.translate.use('de'); // override language
  }

  ngOnInit(): void {
    this.config = this.appConfigurationService;
  }

}
