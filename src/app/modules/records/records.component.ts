import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user/user.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { EncounterService } from 'src/app/shared/services/encounter.service';
import { QueingService } from 'src/app/shared/services/queing.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {
  public imagePath: any;
  public isOnQue: boolean;
  public patientId: string;
  public fullname: string;
  public created: Date;
  constructor(
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private uploadService: UploadService,
    private encounterService: EncounterService,
    private queingService: QueingService
  ) { }

  recordForms = [
    {
      id: 1,
      name: 'Height',
      slug: 'height',
      formInputs: [
        {label: 'Date', type: 'date'},
        {label: 'Height', type: 'text'}
      ]
    },
    {
      id: 2,
      name: 'Weight',
      slug: 'weight',
      formInputs: [
        {label: 'Date', type: 'date'},
        {label: 'Weight', type: 'text'}
      ]
    }
  ];

  ngOnInit() {

    this.activatedRoute.parent.params.subscribe(
      (param) => {
        this.patientId = param.patientId;
      }
    );
    this.uploadService.get(this.patientId).subscribe((res) => {
      this.imagePath = res.image;
    });

    this.queingService.checkPatientOnQue(this.patientId).subscribe((queing) => {
      this.isOnQue = queing.onQue;
    });

    this.userService.get(this.patientId).subscribe((patient) => {
      console.log(patient);
      this.fullname = patient.firstname + ' ' + patient.midlename + ' ' + patient.lastname;
      this.created = patient.createdAt;
    });

  }

  onCancelVisit(patientId: string) {
    this.queingService.cancel(patientId).subscribe((que) => {
      if (que) {
        this.notificationService.success(':: on que canceled.');
        this.isOnQue = false;
      }
    });
  }

  onMoveToQue(patientId: string) {
    this.queingService.insert(patientId).subscribe((que) => {
      if (que) {
        this.notificationService.success(':: on que done. #' + que.que.queNumber);
        this.isOnQue = true;
      }
    });
  }

  generateQrCode(patientId: string) {
    console.log(patientId);
  }
}
