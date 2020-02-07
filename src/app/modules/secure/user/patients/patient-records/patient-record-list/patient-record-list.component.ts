import { Component, OnInit } from '@angular/core';
import { BlockchainService } from 'src/app/shared/services/blockchain.service';
import { Blockchain } from 'src/app/shared/interfaces/blockchain';
import { Observable } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { PatientRecordFormComponent } from '../patient-record-form/patient-record-form.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-patient-record-list',
  templateUrl: './patient-record-list.component.html',
  styleUrls: ['./patient-record-list.component.scss']
})
export class PatientRecordListComponent implements OnInit {
  public blockchains: Observable<Blockchain[]>;

  public perPage: number;
  public currentPage: number;

  public patientId: string;
  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private blockchainService: BlockchainService,
    private router: Router
  ) {
    this.perPage = 10;
    this.currentPage = 1;
  }

  ngOnInit() {
    this.blockchainService.getChain(this.perPage, this.currentPage);
    this.blockchains = this.blockchainService.getChainListener();

    this.activatedRoute.parent.parent.params.subscribe(
      (param) => {
        this.patientId = param.patientId;
      }
    );
  }

  onCreate() {
    this.router.navigate(['../form'], {relativeTo: this.activatedRoute});
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.hasBackdrop = true;
    // dialogConfig.width = '60%';
    // dialogConfig.data = {
    //   id: this.patientId,
    //   title: 'Create New',
    //   button: 'Save'
    // };
    // this.dialog.open(PatientRecordFormComponent, dialogConfig).afterClosed().subscribe(result => {
    //   this.blockchainService.getChain(this.perPage, this.currentPage);
    // });
  }
}
