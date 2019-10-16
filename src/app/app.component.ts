import { Component, OnInit  } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { AuthService } from './auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`
  main {
    margin: 5em 0;
    padding: 0 15px;
  }
  `]
})
export class AppComponent implements OnInit {
  title: string;

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

    this.title = 'clinic-plus';
  }
}
