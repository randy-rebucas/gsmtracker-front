import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-record',
    templateUrl: './record.component.html',
    styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {
    @Input() widget: string; // list, blocks, table, grid
    @Input() hasPrefix: boolean;
    @Input() prefix: string; // kg, cm
    @Input() type: string; // height, weight
    @Input() showPrevious: boolean;
    @Input() showDate: boolean;

    constructor(public router: Router) {}

    ngOnInit() {
      console.log(this.type);
    }

}
