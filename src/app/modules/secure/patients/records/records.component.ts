import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../user/user.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { EncounterService } from 'src/app/shared/services/encounter.service';
import { QueingService } from 'src/app/shared/services/queing.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { FormArray, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {
  cards: any;

  public imagePath: any;
  public isOnQue: boolean;
  public patientId: string;
  public fullname: string;
  public created: Date;

  public form: FormGroup;

  records: any[] = [
    {name: 'Complaint', slug: 'complaint' },
    {name: 'Family History', slug: 'family-history' },
    {name: 'Social History', slug: 'social-history' },
    {name: 'Present Illness', slug: 'present-illness' },
    {name: 'Past Medical', slug: 'past-medical' },
    {name: 'Physical Exam', slug: 'physical-exam' },
    {name: 'Vital Sign', slug: 'vital-sign' },
    {name: 'Precription', slug: 'prescription' },
    {name: 'Progress Note', slug: 'progress-notes' },
    {name: 'Assessment', slug: 'assessment' }
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private uploadService: UploadService,
    private encounterService: EncounterService,
    private queingService: QueingService,

    private fb: FormBuilder,
  ) { }

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
      this.fullname = patient.firstname + ' ' + patient.midlename + ' ' + patient.lastname;
      this.created = patient.createdAt;
    });


    this.cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(({ matches }) => {
        if (matches) {
         //mobile
        }
      // default
      })
    );

    this.form = this.fb.group({
      prescriptions: this.fb.array([this.addPrescriptionGroup()])
    });
  }

  addPrescriptionGroup() {
    return this.fb.group({
      maintenableFlg: [],
      medicine: ['', [Validators.required]],
      preparation: [''],
      sig: ['', [Validators.required]],
      quantity: [1, [Validators.required]]
    });
  }

  addPrescription() {
    this.prescriptionArray.push(this.addPrescriptionGroup());
  }

  removePrescription(index: number) {
    this.prescriptionArray.removeAt(index);
    this.prescriptionArray.markAsDirty();
    this.prescriptionArray.markAsTouched();
  }

  get prescriptionArray() {
    return this.form.get('prescriptions') as FormArray;
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

  onSetOption(recordType: string, isExpanded: boolean, isDeleted: boolean ) {
    const recordObject = {
      expanded: isExpanded,
      deleted: isDeleted
    };
    // console.log(recordObject);
    localStorage.setItem(recordType, JSON.stringify(recordObject));

  }

  onGetOption(recordType: string) {
    const recordObject = localStorage.getItem(recordType);
    return JSON.parse(recordObject);
  }

  onSubmit() {

  }
}
