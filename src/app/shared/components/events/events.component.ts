import { Component, OnInit } from '@angular/core';
export interface Section {
  name: string;
  updated: Date;
}
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  folders: Section[] = [
    {
      name: 'Swimming',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Metting',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Vacation',
      updated: new Date('1/28/16'),
    }
  ];
  notes: Section[] = [
    {
      name: 'Randy Rebucas',
      updated: new Date('2/20/16'),
    },
    {
      name: 'John Doe',
      updated: new Date('1/18/16'),
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
