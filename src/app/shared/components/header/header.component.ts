import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAuth = true;

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  @Output() logout = new EventEmitter<boolean>();

  @Input() isAuthenticated: boolean;

  constructor() { }

  ngOnInit() { }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

  onLogout() {
    // Output the value
    this.logout.emit(this.isAuth);
  }
}
