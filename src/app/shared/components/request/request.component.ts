import { Component, OnInit, Inject } from '@angular/core';
import { Blockchain } from '../../interfaces/blockchain';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { AccessService } from '../../services/access.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  title: string;
  blocks: Blockchain[];
  newBlocks: Blockchain[];
  optionPicked: string;
  selectedOption: string;
  patientId: string;
  canRequest: boolean;
  pubKey: string;

  constructor(
    private accessService: AccessService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef < RequestComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.blocks = data.blocks;
    this.selectedOption = data.block;
    this.title = data.title;
    this.patientId = data.id;
    this.pubKey = this.authenticationService.getPublicKey();
  }

  ngOnInit(): void {
    this.blocks =  this.blocks.filter((block) => {
      return block.transactions.fromAddress !== this.pubKey;
    });

    this.optionPicked = (this.selectedOption) ? 'select' : 'all';
    if (this.selectedOption) {
      this.checkAccess(this.selectedOption, this.authenticationService.getUserId());
    }
  }

  onChangeOption(event: MatRadioChange) {
    this.optionPicked = event.value;
    if (event.value === 'select') {
      this.selectedOption = this.blocks[0]._id;
    } else {
      this.selectedOption = '';
    }
  }

  filterBlock(event: MatSelectChange) {
    this.selectedOption = event.value;
    if (event.value) {
      this.checkAccess(event.value, this.authenticationService.getUserId());
    }
  }

  checkAccess(blockId: string, physicianId: string) {
    this.accessService.hasAcceess(blockId, physicianId).subscribe((res) => {
      if (res.canAccess) {
        this.translate.get('common.has-permitted', {s: blockId}
        ).subscribe((norifResMessgae: string) => {
          this.notificationService.success(norifResMessgae);
        });
        this.canRequest = true;
      } else {
        this.canRequest = false;
      }
    });
  }

  onRequest() {
    const selectedBlocks = [];
    if (this.optionPicked === 'all') {
      for (const block of this.blocks) {
        selectedBlocks.push({blockId: block._id});
      }
    } else {
      selectedBlocks.push({blockId: this.selectedOption});
    }
    const assignAccess = {
      blocks: selectedBlocks,
      physicianId: this.authenticationService.getUserId(),
      patientId : this.patientId
    };

    this.accessService.insert(assignAccess).subscribe((res) => {
      this.translate.get('common.updated-message', {s: 'Access'}
        ).subscribe((norifResMessgae: string) => {
          this.notificationService.success(norifResMessgae);
        });
      this.dialogRef.close();
    });
  }
}
