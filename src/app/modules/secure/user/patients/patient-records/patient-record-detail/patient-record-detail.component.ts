import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockchainService } from 'src/app/shared/services/blockchain.service';
import { Blockchain } from 'src/app/shared/interfaces/blockchain';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-record-detail',
  templateUrl: './patient-record-detail.component.html',
  styleUrls: ['./patient-record-detail.component.scss']
})
export class PatientRecordDetailComponent implements OnInit, OnDestroy {
  blockId: string;
  blockchain: Blockchain;
  blockchainSub: Subscription;

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

      console.log(this.blockchain);
      // for (const key of Object.keys(block.transactions.data)) {
      //   const record = block.transactions.data[key];
      //   // ... do something with mealName
      //   this.records.push(record);
      // }

    });

  }

  ngOnDestroy() {
    // unsubscribe
    this.blockchainSub.unsubscribe();
  }
}
