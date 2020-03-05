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
  public blockchains: Blockchain[];

  isLoading: boolean;
  constructor(
    private blockchainService: BlockchainService
  ) {
    this.isLoading = true;
  }

  ngOnInit(): void {
    // get patient blockchain
    this.blockchainService.getByUser(this.patientAddress).subscribe((blockchain) => {
      this.blockchains = blockchain;
      this.isLoading = false;
    });
  }

}
