import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';
import { UserService } from '../user/user.service';
import { BlockchainService } from 'src/app/shared/services/blockchain.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );

  public perPage: number;
  public currentPage: number;
  public pageSizeOptions: any;

  private isActivated: boolean;
  private blockchainSub: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private blockchainService: BlockchainService
  ) {
    this.perPage = 10;
    this.currentPage = 1;
    this.pageSizeOptions = [5, 10, 25, 100];
  }

  ngOnInit() {
    const userId = this.authenticationService.getUserId();

    this.blockchainService.getChain(this.perPage, this.currentPage, userId);
    this.blockchainSub = this.blockchainService.getChainListener().subscribe((blockchain) => {
      const chain = blockchain.chain;
      console.log(chain);
    });
  }
}
