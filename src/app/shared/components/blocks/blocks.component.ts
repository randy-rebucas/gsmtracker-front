import { Component, OnInit, Input } from '@angular/core';
import { BlockchainService } from '../../services/blockchain.service';
import { Observable } from 'rxjs';
import { Blockchain } from '../../interfaces/blockchain';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss']
})
export class BlocksComponent implements OnInit {
  @Input() patientAddress: string;
  public blockchains: Observable<Blockchain[]>;

  constructor(
    private blockchainService: BlockchainService
  ) { }

  ngOnInit(): void {
    // get patient blockchain
    this.blockchains = this.blockchainService.getByUser(this.patientAddress);
  }

}
