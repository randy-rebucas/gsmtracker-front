import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public title: any;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const segments = this.router.url;
      const segment = segments.split('/');
      this.title = segment[1] + ' ' + segment[2];
    });
  }

  ngOnInit() {}

}
