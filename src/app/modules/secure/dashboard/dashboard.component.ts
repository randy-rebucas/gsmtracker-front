import { Component, OnInit, OnDestroy } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BlockchainService } from './../../../shared/services/blockchain.service';
import { Blockchain } from '../../../shared/interfaces/blockchain';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public cards: Observable<any>;
  public blockchains: Observable<Blockchain[]>;

  public perPage: number;
  public currentPage: number;
  isLoading: boolean;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private blockchainService: BlockchainService
  ) {
    this.perPage = 10;
    this.currentPage = 1;
    this.isLoading = true;
  }

  ngOnInit() {
    this.blockchainService.getChain(this.perPage, this.currentPage);
    this.blockchains = this.blockchainService.getChainListener();

    this.blockchains.subscribe(() => {
      this.isLoading = false;
    });
      /** Based on the screen size, switch from standard to one column per row */
    this.cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(({ matches }) => {
        if (matches) {
          return [
            { title: 'Statistics', cols: 1, rows: 1 },
            { title: 'Weather Forecast', cols: 1, rows: 1 },
            { title: 'Record Chain', cols: 1, rows: 1 },
            { title: 'Ads', cols: 1, rows: 1 }
          ];
        }

        return [
          { title: 'Statistics', cols: 2, rows: 1 },
          { title: 'Weather Forecast', cols: 1, rows: 1 },
          { title: 'Record Chain', cols: 1, rows: 2 },
          { title: 'Ads', cols: 1, rows: 1 }
        ];
      })
    );

  }

  ngOnDestroy() {

  }
}
