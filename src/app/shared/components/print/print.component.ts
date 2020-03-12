import { Component, OnInit, OnDestroy } from '@angular/core';
import { LabelsService } from '../../services/labels.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import * as jsPDF from 'jspdf';
import { PatientsService } from 'src/app/modules/secure/user/patients/patients.service';
import { MatSelectChange } from '@angular/material/select';
import { SettingsService } from '../../services/settings.service';
import { Settings } from '../../interfaces/settings';
import { switchMap } from 'rxjs/operators';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit, OnDestroy {
  selectedOption: string;
  userId: string;
  labelsSub: Subscription;
  labels: any[];
  setting: Settings;
  imagePath: any;
  settingsData: any;

  constructor(
    private labelsService: LabelsService,
    private settingsService: SettingsService,
    private uploadService: UploadService,
    private authenticationService: AuthenticationService,
    private patientsService: PatientsService
  ) {
    this.selectedOption = 'my-patient';
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit(): void {
    this.labelsService.getAll(this.userId);
    this.labelsSub = this.labelsService.getLabels()
      .subscribe((res) => {
      this.labels = res.labels;
    });

    this.settingsService.getSetting(this.userId);
    this.settingsService.getSettingListener()
    .pipe(
      switchMap(setting => {
        this.setting = setting;
        return this.uploadService.get(setting._id);
      })
    )
    .subscribe((mergeRes) => {
      this.settingsData = { ...this.setting, ...mergeRes };
    });
  }

  onPrint() {
    const hasLabel = (this.selectedOption !== 'my-patient') ? this.selectedOption : '';
    this.patientsService.getMyPatient(this.userId, null, null, hasLabel);
    this.patientsService.getUpdateListener().subscribe((patient) => {

      const datePipe = new DatePipe('en-US');
      const pdfDoc = new jsPDF('p', 'mm', 'a4');
      const pageHeight = pdfDoc.internal.pageSize.height || pdfDoc.internal.pageSize.getHeight();
      const pageWidth = pdfDoc.internal.pageSize.width || pdfDoc.internal.pageSize.getWidth();

      // clinic owner
      pdfDoc.setFontSize(16);
      pdfDoc.setFont('normal');
      pdfDoc.addImage(this.settingsData.image, 'PNG', 10, 10, 18, 18);
      pdfDoc.text(this.settingsData.clinicname, 35, 10, null, null, 'left');

      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      const addresses = this.settingsData.prescription.rxAddresses;
      addresses.forEach(element => {
        pdfDoc.text(element.address1, 35, 14, null, null, 'left');
        let gap = 0;
        if (element.address2) {
          gap = 4;
          pdfDoc.text(element.address2, 35, 18, null, null, 'left');
        }
        pdfDoc.text('' + element.postalCode + '', 35, 18 + gap, null, null, 'left');
        pdfDoc.text(element.province, 45, 18 + gap, null, null, 'left');
        pdfDoc.text(element.city, 70, 18 + gap, null, null, 'left');
        pdfDoc.text(element.country, 35, 22 + gap, null, null, 'left');
      });

      pdfDoc.text('Clinic hour', 125, 14, null, null, 'left');
      const hours = this.settingsData.prescription.rxHours;
      for (let index = 0; index < hours.length; index++) {
        const element = hours[index];
        pdfDoc.text(element.morningOpen + ' - ' + element.afternoonClose, 155, 14 + ( index * 4 ), null, null, 'left');
      }

      pdfDoc.text('Tel no: ', 125, 18, null, null, 'left');
      const contacts = this.settingsData.prescription.rxPhones;
      for (let index = 0; index < contacts.length; index++) {
        const element = contacts[index];
        pdfDoc.text(element.contact, 155, 18 + ( index * 4 ), null, null, 'left');
      }

      pdfDoc.line(10, 28, 200, 28);

      pdfDoc.setFontSize(12);
      pdfDoc.setFont('courier');
      pdfDoc.text('Fullname', 10, 32, null, null, 'left');
      pdfDoc.text('Contact', 125, 32, null, null, 'left');
      pdfDoc.text('Gender', 155, 32, null, null, 'left');
      pdfDoc.text('Birthdate', 175, 32, null, null, 'left');

      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');

      for (let index = 0; index < patient.patients.length; index++) {
        const element = patient.patients[index];
        pdfDoc.text(element.firstname + ' ' + element.midlename + ', ' + element.lastname, 10, 37 + (index * 8), null, null, 'left');
        pdfDoc.text(element.contact, 125, 37 + (index * 8), null, null, 'left');
        pdfDoc.text(element.gender, 155, 37 + (index * 8), null, null, 'left');
        pdfDoc.text(datePipe.transform(element.birthdate, 'MMM dd, yyyy'), 175, 37 + (index * 8), null, null, 'left');
        pdfDoc.text('Address: ', 15, 41 + (index * 8), null, null, 'left');
        element.address.forEach(el => {
          if (el.current) {
            pdfDoc.text(el.address1 + '' + (el.address2) ? el.address2 : '' + ', ' +
            el.postalCode +
            el.province + el.city + el.country, 35, 41 + (index * 8), null, null, 'left');
          }
        });
      }
      pdfDoc.autoPrint();
      pdfDoc.output('dataurlnewwindow');
    });
  }

  filterLabel(label: MatSelectChange) {
    this.selectedOption = label.value;
  }

  ngOnDestroy() {
    this.labelsSub.unsubscribe();
  }
}
