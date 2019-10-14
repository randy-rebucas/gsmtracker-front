import { Component, OnInit, Input } from '@angular/core';
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

@Component({
    selector: 'app-record',
    templateUrl: './record.component.html',
    styleUrls: ['./record.component.css']
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
    recordData: any[] = [];

    private recordSub: Subscription;

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
      public immunizationService: ImmunizationService
    // public historyService: HistoryService,
    // public assessmentService: AssessmentService,
    // public prescriptionService: PrescriptionService,
    // public uploadService: UploadService
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
        // case 'prescription':
        // break;
        // case 'assessments':
        // break;
        // case 'test-results':
        // break;
        default: // allergies

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

}
