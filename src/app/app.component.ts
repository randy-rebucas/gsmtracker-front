import { Component, OnInit  } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private meta: Meta
    ) {}

  ngOnInit() {
    this.meta.addTag({name: 'keywords', content: 'Clinical Web Application'});
    this.meta.addTag({name: 'description', content: 'Clinical Web Application'});
    this.meta.addTag({name: 'author', content: 'Randy Rebucas'});
    this.meta.addTag({name: 'robots', content: 'index, follow'});
    this.authService.autoAuthUser();
  }
}
