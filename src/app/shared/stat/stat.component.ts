import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-stat',
    templateUrl: './stat.component.html',
    styleUrls: ['./stat.component.css']
})
export class StatComponent implements OnInit {
    @Input() bgClass: string;
    @Input() icon: string;
    @Input() count: number;
    @Input() label: string;
    @Input() data: number;
    @Input() link: string;

    constructor(public router: Router) {}

    ngOnInit() {
      console.log(this.link);
    }

    onDetails(arg) {
      this.router.navigate(['/' + arg + '']);
    }
}
