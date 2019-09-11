import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Title } from '@angular/platform-browser';
import { MatDialogConfig, MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

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
  /**
   * datalist options
   */
  public total = 0;
  public perPage = 10;
  public currentPage = 1;
  public pageSizeOptions = [5, 10, 25, 100];

  /**
   * person data types
   */
  public personId: string;
  public image: string;
  public firstname: string;
  public midlename: string;
  public lastname: string;
  public contact: string;
  public gender: string;
  public birthdate: string;
  public address: string;

  /**
   * patient data types
   */
  public patientId: string;
  public bloodType: string;
  public comments: string;

  /**
   * user/client types
   */
  public userId: string;

  /**
   * common variables
   */
  public userIsAuthenticated = false;
  public isLoading = false;

  /**
   * record types
   */
  public recordId: string;

  /**
   * Subscriptions
   */
  public authListenerSubs: Subscription;

  public dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

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

    this.isLoading = true;
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

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    console.log('destryoed');
  }
}
