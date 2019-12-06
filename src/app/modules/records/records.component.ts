import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user/user.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { EncounterService } from 'src/app/shared/services/encounter.service';
import { QueingService } from 'src/app/shared/services/queing.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Cheif Complaint', type: 'complaint', cols: 1, rows: 1 },
          { title: 'Family History', type: 'family-history', cols: 1, rows: 1 },
          { title: 'Social History', type: 'social-history', cols: 1, rows: 1 },
          { title: 'Present Illness', type: 'present-illness', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Cheif Complaint', type: 'complaint', cols: 2, rows: 1 },
        { title: 'Family History', type: 'family-history', cols: 1, rows: 1 },
        { title: 'Social History', type: 'social-history', cols: 1, rows: 2 },
        { title: 'Present Illness', type: 'present-illness', cols: 1, rows: 1 }
      ];
    })
  );

  public imagePath: any;
  public isOnQue: boolean;
  public patientId: string;
  public fullname: string;
  public created: Date;

  // public form: FormGroup;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private uploadService: UploadService,
    private encounterService: EncounterService,
    private queingService: QueingService,

    // private fb: FormBuilder,
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


    // this.form = this.fb.group({
    //   record_date: [new Date(), [Validators.required]],
    //   prescriptions: this.fb.array([this.addPrescriptionGroup()])
    // });
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

  // addPrescriptionGroup() {
  //   return this.fb.group({
  //     maintenableFlg: [],
  //     medicine: ['', [Validators.required]],
  //     preparation: [''],
  //     sig: ['', [Validators.required]],
  //     quantity: [1, [Validators.required]]
  //   });
  // }

  // addPrescription() {
  //   this.prescriptionArray.push(this.addPrescriptionGroup());
  // }

  // removePrescription(index) {
  //   this.prescriptionArray.removeAt(index);
  //   this.prescriptionArray.markAsDirty();
  //   this.prescriptionArray.markAsTouched();
  // }

  // get prescriptionArray() {
  //   return this.form.get('prescriptions') as FormArray;
  // }
}
