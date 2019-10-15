import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeightService } from 'src/app/patients/patient-record/services/height.service';
import { WeightService } from 'src/app/patients/patient-record/services/weight.service';
import { TemperatureService } from 'src/app/patients/patient-record/services/temperature.service';
import { BpService } from 'src/app/patients/patient-record/services/bp.service';
import { RprService } from 'src/app/patients/patient-record/services/rpr.service';
import { PrService } from 'src/app/patients/patient-record/services/pr.service';
import { ComplaintService } from 'src/app/patients/patient-record/services/complaint.service';
import { Subscription } from 'rxjs';
import { ComplaintData } from 'src/app/patients/patient-record/models/complaint-data.model';
import { EndorsementService } from 'src/app/patients/patient-record/services/endorsement.service';
import { EndorsementData } from 'src/app/patients/patient-record/models/endorsement-data.model';
import { PresentIllnessService } from 'src/app/patients/patient-record/services/present-illness.service';
import { PresentIllnessData } from 'src/app/patients/patient-record/models/present-illness-data';
import { PastMedicalService } from 'src/app/patients/patient-record/services/past-medical.service';
import { PastMedicalData } from 'src/app/patients/patient-record/models/past-medical-data.model';
import { SocialService } from 'src/app/patients/patient-record/services/social.service';
import { SocialData } from 'src/app/patients/patient-record/models/social-data';
import { FamilyHistoryService } from 'src/app/patients/patient-record/services/family-history.service';
import { FamilyHistoryData } from 'src/app/patients/patient-record/models/family-history-data';
import { OrderService } from 'src/app/patients/patient-record/services/order.service';
import { OrderData } from 'src/app/patients/patient-record/models/order-data.model';
import { NotesService } from 'src/app/patients/patient-record/services/notes.service';
import { NoteData } from 'src/app/patients/patient-record/models/note.model';
import { ImmunizationService } from 'src/app/patients/patient-record/services/immunization.service';
import { ImmunizationData } from 'src/app/patients/patient-record/models/immunization-data.model';
import { PrescriptionService } from 'src/app/patients/patient-record/services/prescription.service';
import { PrescriptionData } from 'src/app/patients/patient-record/models/prescription-data.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AssessmentService } from 'src/app/patients/patient-record/services/assessment.service';
import { AssessmentData } from 'src/app/patients/patient-record/models/assessment-data.model';
import { UploadService } from 'src/app/upload/upload.service';
import { UploadData } from 'src/app/upload/upload-data.model';
import { AllergyService } from 'src/app/patients/patient-record/services/allergy.service';
import { AllergyData } from 'src/app/patients/patient-record/models/allergy-data.model';

import { Lightbox } from 'ngx-lightbox';
@Component({
    selector: 'app-record',
    templateUrl: './record.component.html',
    styles: [`
    .hide {
      display: none;
    }
    mat-row.example-detail-row {
      min-height: 0;
    }
    .example-element-detail {
      width: 100%;
    }
    .mat-card-title {
      font-size: 14px;
    }
    .mat-list-inner-data {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .mat-list-inner-data > div {
      min-width: 200px;
      align-items: stretch;
      align-self: center;
      justify-content: space-between;
    }
    .mat-list-inner-data > div:last-child {
      flex-grow: 1;
    }
    .mat-list-inner-data > div:first-child {
      flex-grow: 1;
    }
    mat-card.hasMinHeight {
      min-height: 228px;
    }
    mat-card-title.mat-card-title > button {
      position: absolute;
      right: 0;
      top: 0;
    }

    table#prescriptions {
      width: 100%;
      margin: 1em 0;
    }

    table#prescriptions tr td {
      color: rgb(51, 122, 183);
      font-weight: bold;
      font-size: 16px;
      font-family: monospace;
    }

    table#prescriptions tr td span {
      font-weight: 100;
      font-size: 14px;
      font-style: italic;
    }

    table#prescriptions tr td {
      height: unset !important;
      vertical-align: text-bottom;
    }
    table#prescriptions tr td {
      color: rgba(0,0,0,.87) !important;
    }

    table#prescriptions tr td span {
        color: rgb(51, 122, 183);
    }

    td.mat-cell button {
      float: right;
    }
    `],
    animations: [
      trigger('detailExpand', [
        state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
        state('expanded', style({ height: '*', visibility: 'visible' })),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
    ],
})
export class RecordComponent implements OnInit {
    @Input() widget: string; // list, blocks, table, grid
    @Input() hasPrefix: boolean;
    @Input() prefix: string; // kg, cm
    @Input() type: string; // height, weight
    @Input() showPrevious: boolean;
    @Input() showDate: boolean;
    @Input() patientId: string;

    latestRecord: string;
    latestRecordDate: string;
    lastRecord: string;
    lastRecordDate: string;

    isLoading = false;
    total = 0;
    perPage = 10;
    currentPage = 1;
    pageSizeOptions = [5, 10, 25, 100];
    recordData: any[] = [];

    private recordSub: Subscription;

    dataSource: MatTableDataSource<any>;
    columnsToDisplay: string[];
    expandedElement: any;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(
      public router: Router,
      private route: ActivatedRoute,
      public heightService: HeightService,
      public weightService: WeightService,
      public temperatureService: TemperatureService,
      public bpService: BpService,
      public rprService: RprService,
      public prService: PrService,
      public complaintService: ComplaintService,
      public endorsementService: EndorsementService,
      public presentIllnessService: PresentIllnessService,
      public pastMedicalService: PastMedicalService,
      public socialService: SocialService,
      public familyHistoryService: FamilyHistoryService,
      public orderService: OrderService,
      public notesService: NotesService,
      public immunizationService: ImmunizationService,
      public prescriptionService: PrescriptionService,
      public assessmentService: AssessmentService,
      public uploadService: UploadService,
      public allergyService: AllergyService,


      private lightbox: Lightbox
    ) {}

    async ngOnInit() {
      switch (this.type) {
        case 'height':
          const heightLatestResponse = await this.heightService.getLatest(this.patientId).toPromise();
          if (heightLatestResponse) {
            this.latestRecord = heightLatestResponse.height;
            this.latestRecordDate = heightLatestResponse.created;
          }

          const heightResponse = await this.heightService.getLast(this.patientId).toPromise();
          if (heightResponse) {
            this.lastRecord = heightResponse.height;
            this.lastRecordDate = heightResponse.created;
          }
          break;
        case 'weight':
          const weightLatestResponse = await this.weightService.getLatest(this.patientId).toPromise();
          if (weightLatestResponse) {
            this.latestRecord = weightLatestResponse.weight;
            this.latestRecordDate = weightLatestResponse.created;
          }

          const weightResponse = await this.weightService.getLast(this.patientId).toPromise();
          if (weightResponse) {
            this.lastRecord = weightResponse.weight;
            this.lastRecordDate = weightResponse.created;
          }
          break;
        case 'oxygen-saturation':
          break;
        case 'pain-score':
          break;
        case 'temperature':
          const tempLatestResponse = await this.temperatureService.getLatest(this.patientId).toPromise();
          if (tempLatestResponse) {
            this.latestRecord = tempLatestResponse.temperature;
            this.latestRecordDate = tempLatestResponse.created;
          }

          const tempResponse = await this.temperatureService.getLast(this.patientId).toPromise();
          if (tempResponse) {
            this.lastRecord = tempResponse.temperature;
            this.lastRecordDate = tempResponse.created;
          }
          break;
        case 'blood-pressure':
          const bpLatestResponse = await this.bpService.getLatest(this.patientId).toPromise();
          if (bpLatestResponse) {
            this.latestRecord = bpLatestResponse.systolic + '/' + bpLatestResponse.diastolic;
            this.latestRecordDate = bpLatestResponse.created;
          }

          const bpResponse = await this.bpService.getLast(this.patientId).toPromise();
          if (bpResponse) {
            this.lastRecord = bpResponse.systolic + '/' + bpResponse.diastolic;
            this.lastRecordDate = bpResponse.created;
          }
          break;
        case 'respiratory-rate':
          const rprLatestResponse = await this.rprService.getLatest(this.patientId).toPromise();
          if (rprLatestResponse) {
            this.latestRecord = rprLatestResponse.respiratoryrate;
            this.latestRecordDate = rprLatestResponse.created;
          }

          const rprResponse = await this.rprService.getLast(this.patientId).toPromise();
          if (rprResponse) {
            this.lastRecord = rprResponse.respiratoryrate;
            this.lastRecordDate = rprResponse.created;
          }
          break;
        case 'pulse-rate':
          const prLatestResponse = await this.prService.getLatest(this.patientId).toPromise();
          if (prLatestResponse) {
            this.latestRecord = prLatestResponse.pulserate;
            this.latestRecordDate = prLatestResponse.created;
          }

          const prResponse = await this.prService.getLast(this.patientId).toPromise();
          if (prResponse) {
            this.lastRecord = prResponse.pulserate;
            this.lastRecordDate = prResponse.created;
          }
          break;
        case 'chief-complaint':
          this.complaintService.getAll(5, 1, this.patientId);
          this.recordSub = this.complaintService
            .getUpdateListener()
            .subscribe((complaintData: {complaints: ComplaintData[], count: number}) => {
              this.isLoading = false;
              this.total = complaintData.count;
              this.recordData = complaintData.complaints;
            });
          break;
        case 'endorsements':
          this.endorsementService.getAll(5, 1, this.patientId);
          this.recordSub = this.endorsementService
            .getUpdateListener()
            .subscribe((endorsementData: {endorsements: EndorsementData[], count: number}) => {
              this.isLoading = false;
              this.total = endorsementData.count;
              this.recordData = endorsementData.endorsements;
            });
          break;
        case 'present-illness-history':
          this.presentIllnessService.getAll(5, 1, this.patientId);
          this.recordSub = this.presentIllnessService
            .getUpdateListener()
            .subscribe((presentIllnessData: {presentIllnesses: PresentIllnessData[], count: number}) => {
              this.isLoading = false;
              this.total = presentIllnessData.count;
              this.recordData = presentIllnessData.presentIllnesses;
            });
          break;
        case 'past-medical-history':
          this.pastMedicalService.getAll(5, 1, this.patientId);
          this.recordSub = this.pastMedicalService
            .getUpdateListener()
            .subscribe((pastMedicalData: {pastMedicals: PastMedicalData[], count: number}) => {
              this.isLoading = false;
              this.total = pastMedicalData.count;
              this.recordData = pastMedicalData.pastMedicals;
            });
          break;
        case 'social-history':
          this.socialService.getAll(5, 1, this.patientId);
          this.recordSub = this.socialService
            .getUpdateListener()
            .subscribe((socialData: {socials: SocialData[], count: number}) => {
              this.isLoading = false;
              this.total = socialData.count;
              this.recordData = socialData.socials;
            });
          break;
        case 'family-history':
          this.familyHistoryService.getAll(5, 1, this.patientId);
          this.recordSub = this.familyHistoryService
            .getUpdateListener()
            .subscribe((familyHistoryData: {familyHistories: FamilyHistoryData[], count: number}) => {
              this.isLoading = false;
              this.total = familyHistoryData.count;
              this.recordData = familyHistoryData.familyHistories;
            });
          break;
        case 'order':
          this.orderService.getAll(5, 1, this.patientId);
          this.recordSub = this.orderService
            .getUpdateListener()
            .subscribe((orderData: {orders: OrderData[], count: number}) => {
              this.isLoading = false;
              this.total = orderData.count;
              this.recordData = orderData.orders;
            });
          break;
        case 'progress-notes':
          this.notesService.getAll(5, 1, this.patientId);
          this.recordSub = this.notesService
            .getUpdateListener()
            .subscribe((noteData: {notes: NoteData[], count: number}) => {
              this.isLoading = false;
              this.total = noteData.count;
              this.recordData = noteData.notes;
            });
          break;
        case 'immunizations':
          this.immunizationService.getAll(5, 1, this.patientId);
          this.recordSub = this.immunizationService
          .getUpdateListener()
          .subscribe((immunizationData: {immunizations: ImmunizationData[], count: number}) => {
            this.isLoading = false;
            this.total = immunizationData.count;
            this.recordData = immunizationData.immunizations;
          });
          break;
        case 'prescription':
          this.columnsToDisplay = ['created'];
          this.prescriptionService.getAll(this.perPage, this.currentPage, this.patientId);
          this.recordSub = this.prescriptionService
            .getUpdateListener()
            .subscribe((prescriptionData: {prescriptions: PrescriptionData[], count: number}) => {
              this.isLoading = false;
              this.total = prescriptionData.count;
              this.dataSource = new MatTableDataSource(prescriptionData.prescriptions);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            });
          break;
        case 'assessments':
          this.columnsToDisplay = ['created'];
          this.assessmentService.getAll(this.perPage, this.currentPage, this.patientId);
          this.recordSub = this.assessmentService
          .getUpdateListener()
          .subscribe((assessmentData: {assessments: AssessmentData[], count: number}) => {
            this.isLoading = false;
            this.total = assessmentData.count;
            this.dataSource = new MatTableDataSource(assessmentData.assessments);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
          break;
        case 'test-results':
          this.uploadService.getAll(this.perPage, this.currentPage, this.patientId);
          this.recordSub = this.uploadService
            .getUpdateListener()
            .subscribe((fileData: {files: UploadData[], count: number}) => {
              this.isLoading = false;
              this.total = fileData.count;
              // this.recordData = fileData.files;
              // tslint:disable-next-line:prefer-for-of
              for (let index = 0; index < fileData.files.length; index++) {
                const element = fileData.files[index];
                const album = {
                 src: element.src,
                 caption: element.name,
                 thumb: element.thumb
                };

                this.recordData.push(album);
              }

            });

          break;
        default: // allergies
          this.allergyService.getAll(this.perPage, this.currentPage, this.patientId);
          this.recordSub = this.allergyService
          .getUpdateListener()
          .subscribe((allergyData: {allergies: AllergyData[], count: number}) => {
            this.isLoading = false;
            this.total = allergyData.count;
            this.recordData = allergyData.allergies;
          });
          break;
      }
    }

    onViewAll(type: any) {
      switch (type) {
        case 'height':
          this.router.navigate(['./record/physical-exams/height'], {relativeTo: this.route});
          break;
        case 'weight':
          this.router.navigate(['./record/physical-exams/weight'], {relativeTo: this.route});
          break;
        case 'oxygen-saturation':
          break;
        case 'pain-score':
          break;
        case 'temperature':
          this.router.navigate(['./record/physical-exams/vital-signs/temperature'], {relativeTo: this.route});
          break;
        case 'blood-pressure':
          this.router.navigate(['./record/physical-exams/vital-signs/blood-pressure'], {relativeTo: this.route});
          break;
        case 'respiratory-rate':
          this.router.navigate(['./record/physical-exams/vital-signs/respiratory-rate'], {relativeTo: this.route});
          break;
        case 'pulse-rate':
          this.router.navigate(['./record/physical-exams/vital-signs/pulse-rate'], {relativeTo: this.route});
          break;
        case 'present-illness-history':
          this.router.navigate(['./record/histories'], {relativeTo: this.route});
          break;
        case 'past-medical-history':
          this.router.navigate(['./record/histories'], {relativeTo: this.route});
          break;
        case 'social-history':
          this.router.navigate(['./record/histories'], {relativeTo: this.route});
          break;
        case 'family-history':
          this.router.navigate(['./record/histories'], {relativeTo: this.route});
          break;
        case 'chief-complaints':
          this.router.navigate(['./record/chief-complaints'], {relativeTo: this.route});
          break;
        case 'order':
          this.router.navigate(['./record/orders'], {relativeTo: this.route});
          break;
        case 'prescription':
          this.router.navigate(['./record/prescriptions'], {relativeTo: this.route});
          break;
        case 'assessments':
          this.router.navigate(['./record/assessments'], {relativeTo: this.route});
          break;
        case 'progress-notes':
          this.router.navigate(['./record/progress-notes'], {relativeTo: this.route});
          break;
        case 'test-results':
          this.router.navigate(['./record/test-results'], {relativeTo: this.route});
          break;
        default:
          this.router.navigate(['./record/immunizations'], {relativeTo: this.route});
      }
    }

    open(index: number): void {
      // open lightbox
      this.lightbox.open(this.recordData, index);
    }

    close(): void {
      // close lightbox programmatically
      this.lightbox.close();
    }
}
