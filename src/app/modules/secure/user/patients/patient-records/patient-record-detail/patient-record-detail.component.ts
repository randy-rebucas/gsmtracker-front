import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockchainService } from 'src/app/shared/services/blockchain.service';
import { Blockchain } from 'src/app/shared/interfaces/blockchain';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-patient-record-detail',
  templateUrl: './patient-record-detail.component.html',
  styleUrls: ['./patient-record-detail.component.scss']
})
export class PatientRecordDetailComponent implements OnInit, OnDestroy {
  blockId: string;
  blockchain: Blockchain;
  blockchainSub: Subscription;

  public dataSource: MatTableDataSource<any>;
  public columnsToDisplay: string[] = [
    'from',
    'to',
    'data'
  ];
  public selection = new SelectionModel<any>(true, []);
  public expandedElement: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private blockchainService: BlockchainService
  ) { }

  ngOnInit() {
    // get block Id
    this.blockId = this.activatedRoute.snapshot.params.blockId;

    // get blockchain information
    this.blockchainSub = this.blockchainService.get(this.blockId).subscribe((block) => {
      this.blockchain = block;

      const enumerableKeys = [];
      // tslint:disable-next-line: prefer-for-of
      for (const iterator of block.transactions.data) {
        console.log(iterator);
      }
      for (let index = 0; index < block.transactions.data.length; index++) {
        const element = block.transactions.data[index];
        console.log(element);
      }

      const record = [];
      for (const key of Object.keys(block.transactions.data)) {
        const mealName = block.transactions.data[key];
        // ... do something with mealName
        record.push(mealName);
      }
      console.log(record);

      // block.transactions.data.forEach( (element) => {
      //   console.log(element);
      //   // element.product_desc = element.product_desc.substring(0,10);
      // });

    });

  }

  ngOnDestroy() {
    // unsubscribe
    this.blockchainSub.unsubscribe();
  }
}
