import { Component, OnInit, Input } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit {
  shareLink: string;

  constructor(private metaService: Meta) {
    this.shareLink = 'https://www.facebook.com/myclinicsoftware/';
  }

  ngOnInit() {}

  onShare(key: string) {
    let urlTarget;
    switch (key) {
      case 'fb':
        urlTarget = 'http://www.facebook.com/sharer.php?u=';
        break;
      case 'twitter':
        urlTarget = 'https://twitter.com/intent/tweet?text=';
        break;
      default:
        urlTarget = 'https://www.linkedin.com/shareArticle?mini=true&url=';
        break;
    }
    const newwindow = window.open(urlTarget + this.shareLink, 'name', 'height=500,width=520,top=200,left=300,resizable');
    if (window.focus) {
        newwindow.focus();
    }
  }

}
