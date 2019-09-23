import { Component, OnInit  } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { AuthService } from './auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`
  body {
      margin: 0;
  }
  main {
    padding: 15px;
    height: 100%;
  }
  app-main-nav {
      height: 100%;
  }
  `]
})
export class AppComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private meta: Meta,
    private translate: TranslateService
    ) {
      translate.setDefaultLang('en');
    }

  ngOnInit() {
    this.meta.addTag({name: 'keywords', content: 'Clinical Web Application'});
    this.meta.addTag({name: 'description', content: 'Clinical Web Application'});
    this.meta.addTag({name: 'author', content: 'Randy Rebucas'});
    this.meta.addTag({name: 'robots', content: 'index, follow'});
    this.authService.autoAuthUser();
  }
}
