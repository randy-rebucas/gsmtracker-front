import { Component, OnInit, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, AfterViewInit {
  public initials: string;
  public bgColor: any;

  @Input() firstname: string;
  @Input() lastname: string;
  @Input() fullname: string;
  @Input() isFullname: boolean;
  @Input() isRounded: boolean;
  @Input() size: number;
  @Input() src: string;

  constructor(private cdr: ChangeDetectorRef) {
    this.isFullname = false;
    this.isRounded = true;
    this.lastname = null;
    this.firstname = null;
    this.fullname = null;
    this.size = 40;
  }

  ngOnInit() {
    let fName = '-';
    let lName = '-';
    let flName = [];

    if (this.isFullname) {
      if (this.fullname) {
        flName = this.fullname.split(' ');
        fName = flName[0].charAt(0); // Returns "f"
        lName = flName[1].charAt(0); // Returns "f"
      }
    } else {
      if (this.firstname || this.lastname ) {
        fName = this.firstname.charAt(0); // Returns "f"
        lName = this.lastname.charAt(0); // Returns "f"
      }
    }

    this.initials = fName + lName;
  }

  setSize() {
    return this.size + 'px';
  }

  setFontSize() {
    const fontSize = Math.trunc(this.size / 3) + 'px/' + this.size + 'px';
    return fontSize + ' Helvetica, Arial, sans-serif';
  }

  setRadius() {
    return (this.isRounded) ? '100%' : '0';
  }

  ngAfterViewInit() {
    this.bgColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    this.cdr.detectChanges();
  }
}
