import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Title } from '@angular/platform-browser';
import { MatDialogConfig, MatDialog } from '@angular/material';

@Component({
  selector: 'app-secure',
  template: `
    <p>
      secure works!
    </p>
  `,
  styleUrls: ['./secure.component.css']
})
export class SecureComponent implements OnInit, OnDestroy {

  public total = 0;
  public perPage = 10;
  public currentPage = 1;
  public pageSizeOptions = [5, 10, 25, 100];

  public userIsAuthenticated = false;
  public userId: string;
  public isLoading = false;
  public authListenerSubs: Subscription;

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public router: Router,
    public titleService: Title
  ) { }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
    });
  }

  onSetTitle(title: string) {
    this.titleService.setTitle(title);
  }

  onPopup(Id: string, dialogTitle: string, dialogButonText: string, dialogWidth: string, targetComponent: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = dialogWidth;
    dialogConfig.data = {
      id: Id,
      title: dialogTitle,
      btnLabel: dialogButonText
    };
    this.dialog.open(targetComponent, dialogConfig);
  }
  
  onDelete(Id) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      this.onConfirmDelete(Id);
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
