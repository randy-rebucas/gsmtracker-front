import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  message = 'An unknown error occured!';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {message: string},
    private translate: TranslateService
  ) {
    translate.setDefaultLang('de'); // default language
    this.translate.use('en'); // override language
  }

  ngOnInit() {

  }

}
