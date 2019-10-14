import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HeightService } from 'src/app/patients/patient-record/services/height.service';
import { WeightService } from 'src/app/patients/patient-record/services/weight.service';
import { TemperatureService } from 'src/app/patients/patient-record/services/temperature.service';
import { BpService } from 'src/app/patients/patient-record/services/bp.service';
import { RprService } from 'src/app/patients/patient-record/services/rpr.service';
import { PrService } from 'src/app/patients/patient-record/services/pr.service';

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

    constructor(
      public router: Router,
      public heightService: HeightService,
      public weightService: WeightService,
      public temperatureService: TemperatureService,
      public bpService: BpService,
      public rprService: RprService,
      public prService: PrService,
    // public historyService: HistoryService,
    // public complaintService: ComplaintService,
    // public assessmentService: AssessmentService,
    // public prescriptionService: PrescriptionService,
    // public notesService: NotesService,
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
            this.lastRecordDate = bpResponse.created;
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
            this.lastRecordDate = bpResponse.created;
          }
          break;
        case 'chief-complaint':
        
        break;
        case 'endorsements':
        
        break;
        case 'present-illness-history':
        
        break;
        case 'past-medical-history':
        
        break;
        case 'social-history':
        
        break;
        case 'family-history':
        
        break;
        case 'order':
        
        break;
        case 'prescription':
        
        break;
        case 'progress-notes':
        
        break;
        case 'assessments':
        
        break;
        case 'immunizations':
        
        break;
        case 'test-results':
        
        break;
        default: // allergies

        break;
      }
      console.log(this.type);
    }

}
