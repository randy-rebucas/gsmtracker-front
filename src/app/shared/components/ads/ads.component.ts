import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit {
  @Input() targetLink: string;
  @Input() targetStyle: string;

  constructor() { }

  ngOnInit() {
  }

}
