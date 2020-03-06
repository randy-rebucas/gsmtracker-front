import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockchainService } from 'src/app/shared/services/blockchain.service';
import { Blockchain } from 'src/app/shared/interfaces/blockchain';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

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
  public displayedColumns: string[] = [
    'medicine',
    'preparation',
    'sig',
    'quantity'
  ];

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
      this.dataSource = block.transactions.data.prescriptions.prescriptions;
    });
  }

  ngOnDestroy() {
    // unsubscribe
    this.blockchainSub.unsubscribe();
  }
}
