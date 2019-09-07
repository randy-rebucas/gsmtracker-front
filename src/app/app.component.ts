import { Component, OnInit  } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { AuthService } from './auth/auth.service';
import { AppConfiguration } from './app-configuration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'clinic-plus';
  apiUrl;
  license: string;

  constructor(
    private authService: AuthService,
    appconfig: AppConfiguration,
    private titleService: Title,
    private meta: Meta
    ) {
      this.title = appconfig.title;
      this.apiUrl = appconfig.apiUrl;
    }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.meta.addTag({name: 'keywords', content: 'Clinical Web Application'});
    this.meta.addTag({name: 'description', content: 'Clinical Web Application'});
    this.meta.addTag({name: 'author', content: 'Randy Rebucas'});
    this.meta.addTag({name: 'robots', content: 'index, follow'});
    this.authService.autoAuthUser();
    this.license = this.authService.getUserLicense();
  }
}
