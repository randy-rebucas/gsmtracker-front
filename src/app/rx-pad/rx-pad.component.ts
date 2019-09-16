import { Component, OnInit, OnDestroy, Inject, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { PrescriptionService } from '../patients/patient-record/services/prescription.service';
import { PatientsService } from '../patients/patients.service';
import { SecureComponent } from '../secure/secure.component';
import { Title } from '@angular/platform-browser';
import { AppConfiguration } from '../app-configuration.service';
import { SettingsGeneralService } from '../settings/settings-general.service';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-rx-pad',
  templateUrl: './rx-pad.component.html',
  styleUrls: ['./rx-pad.component.css']
})
export class RxPadComponent
extends SecureComponent
implements OnInit, OnDestroy {

  @ViewChild('content', {static: false}) content: ElementRef;

  title: string;
  canClosed: boolean;

  id: string;
  created: string;
  complaintId: string;
  prescriptions: any;
  myAge: number;

  clinicOwner: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: any[];
  clinicHours: any[];
  prc: number;
  ptr: number;
  s2: string;
  noBreak: boolean;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public titleService: Title,
    public prescriptionService: PrescriptionService,
    public patientsService: PatientsService,
    public settingsGeneralService: SettingsGeneralService,
    public dialogRef: MatDialogRef < RxPadComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      super(authService, router, dialog, appconfig);
      this.recordId = data.id;
      this.patientId = data.patient;
      this.title = data.title;
      this.canClosed = data.canClose ? true : false;
    }

  ngOnInit() {
    super.doInit();

    this.getPatientData(this.patientId)
      .then((results) => {
        /**
         * disable loading state
         */
        this.isLoading = false;
        /**
         * set the page title
         */
        this.titleService.setTitle(results.patientData.firstname + ' ' + results.patientData.lastname + ' Record');
        /**
         * person data
         */
        this.id = results.patientData._id;
        this.firstname = results.patientData.firstname;
        this.midlename = results.patientData.midlename;
        this.lastname = results.patientData.lastname;
        this.contact = results.patientData.contact;
        this.gender = results.patientData.gender;
        this.birthdate = results.patientData.birthdate;
        this.address = results.patientData.address;
        const today = new Date();
        const bDate = new Date(this.birthdate);
        let age = today.getFullYear() - bDate.getFullYear();
        const m = today.getMonth() - bDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < bDate.getDate())) {
          age--;
        }
        this.myAge = age;
        /**
         * prescription data
         */
        this.prescriptions = results.prescriptionData.prescriptions;

        /**
         * settings
         */
        this.clinicOwner = results.settingData.clinicOwner;
        this.clinicName = results.settingData.clinicName;
        this.clinicAddress = results.settingData.clinicAddress;
        this.clinicPhone = results.settingData.clinicPhone;
        this.clinicHours = results.settingData.clinicHours;
        this.prc = results.settingData.prc;
        this.ptr = results.settingData.ptr;
        this.s2 = results.settingData.s2;
        this.noBreak = results.settingData.nobreak;

      })
      .catch(err => console.log(err));
  }

  async getPatientData(patientId) {
    const patientResponse = await this.patientsService.get(patientId).toPromise();
    const prescriptionResponse = await this.prescriptionService.get(this.recordId).toPromise();
    const settingResponse = await this.settingsGeneralService.get(this.userId).toPromise();
    return {
      patientData: patientResponse,
      prescriptionData: prescriptionResponse,
      settingData: settingResponse
    };
  }

  onClose() {
    this.dialogRef.close();
  }

  printrx() {
    const content = this.content.nativeElement;
    html2canvas(content).then(canvas => {
      const datePipe = new DatePipe('en-US');
      const pdfDoc = new jsPDF('p', 'mm', 'a5');
      const pageHeight = pdfDoc.internal.pageSize.height || pdfDoc.internal.pageSize.getHeight();
      const pageWidth = pdfDoc.internal.pageSize.width || pdfDoc.internal.pageSize.getWidth();
      const specialElementHandlers = {
        '#editor': (element: any, renderer: any) => {
          return true;
        }
      };
      // clinic owner
      pdfDoc.setFontSize(16);
      pdfDoc.setFont('normal');
      pdfDoc.setFontType('italic');
      pdfDoc.text(this.clinicOwner, pageWidth / 2, 20, null, null, 'center');
      // clinic name
      pdfDoc.setFontSize(14);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.text(this.clinicName, pageWidth / 2, 26, null, null, 'center');
      // clinic address
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.text(this.clinicAddress, 10, 35, null, null, 'left');
      // contact numbers
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      const contacts = [];
      this.clinicPhone.forEach(element => {
        contacts.push(element.contact);
      });
      pdfDoc.text('Tel no: ' + contacts.join('/'), 10, 44, null, null, 'left');
      // clinic hour text
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.text('Clinic Hours:', 95, 35, null, null, 'left');
      // clinic hour val
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      const hours = [];
      this.clinicHours.forEach(element => {
        hours.push(element.morningOpen + ' - ' + element.afternoonClose);
      });
      pdfDoc.text(hours.join('/'), 95, 39, null, null, 'left');
      // enable if no nooon break is active
      if (this.noBreak) {
        pdfDoc.setFontSize(10);
        pdfDoc.setFont('courier');
        pdfDoc.setFontType('regular');
        pdfDoc.text('No Noon Break', 95, 44, null, null, 'left');
      }
      // line
      pdfDoc.line(10, 48, 135, 48);
      // patient text
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.text('Patient Name:', 10, 54, null, null, 'left');
      // patient fullname
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.text(this.firstname + ' ' + this.midlename + ' ' + this.lastname, 35, 54, null, null, 'left');
      // birthdate text
      pdfDoc.line(10, 48, 135, 48);
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.text('Birthdate:', 95, 54, null, null, 'left');
      // birthdate
      pdfDoc.line(10, 48, 135, 48);
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      const dob = datePipe.transform(this.birthdate, 'MMM dd, yyyy');
      pdfDoc.text(dob, 115, 54, null, null, 'left');

      // patient text
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.text('Age:', 10, 58, null, null, 'left');
      // patient age val
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      const today = new Date();
      const bDate = new Date(this.birthdate);
      let age = today.getFullYear() - bDate.getFullYear();
      const m = today.getMonth() - bDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < bDate.getDate())) {
        age--;
      }
      pdfDoc.text('' + age + '', 35, 58, null, null, 'left');
      // gender text
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.text('Gender:', 95, 58, null, null, 'left');
      // gender val
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.text(this.gender, 115, 58, null, null, 'left');
      // patient address text
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.text('Address:', 10, 62, null, null, 'left');
      // patient address
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.text(this.address, 35, 62, null, null, 'left');
      // date text
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.text('Date:', 95, 62, null, null, 'left');
      // date val
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      const visitDate = datePipe.transform(today, 'MMM dd, yyyy'); //04/03/1986
      pdfDoc.text(visitDate, 115, 62, null, null, 'left');
      // rx
      pdfDoc.addImage('data:image/png;base64,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', 'PNG', 10, 64, 20, 20);

      // prescriptions
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      let num = 0;
      for (let index = 0; index < this.prescriptions.length; index++) {
        const element = this.prescriptions[index];
        num = (index + 1);
        pdfDoc.setFontType('regular');
        pdfDoc.setTextColor(51, 122, 183);
        pdfDoc.text('' + num + '', 10, 87 + ( index * 10 ), null, null, 'left');
        pdfDoc.setFontType('regular');
        pdfDoc.setTextColor(51, 122, 183);
        pdfDoc.text( element.medicine + ' ' + element.preparation, 15, 87 + ( index * 10 ), null, null, 'left');
        pdfDoc.setFontType('regular');
        pdfDoc.setTextColor(51, 122, 183);
        pdfDoc.text(' # ' + element.quantity, 130, 87 + ( index * 10 ), null, null, 'left');
        pdfDoc.setFontType('italic');
        pdfDoc.setTextColor(51, 122, 183);
        pdfDoc.text(element.sig, 20, 87 + ( index * 10 ) + 5, null, null, 'left');
      }
      // QR code
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.setTextColor(0, 0, 0);
      const contentDataURL = canvas.toDataURL('image/jpg');
      pdfDoc.addImage(contentDataURL, 'JPEG', 10, 175, 30, 20);
      // doctor
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.setTextColor(0, 0, 0);
      pdfDoc.text(this.clinicOwner, 135, 180, null, null, 'right');
      // prc label
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.setTextColor(0, 0, 0);
      pdfDoc.text('License No:', 120, 185, null, null, 'right');
      // prc number
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.setTextColor(0, 0, 0);
      pdfDoc.text(this.prc, 135, 185, null, null, 'right');
      // ptr label
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.setTextColor(0, 0, 0);
      pdfDoc.text('PTR No:', 120, 190, null, null, 'right');
      // ptr number
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.setTextColor(0, 0, 0);
      pdfDoc.text(this.ptr, 135, 190, null, null, 'right');
      // s2 label
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.setTextColor(0, 0, 0);
      pdfDoc.text('S2 No:', 120, 195, null, null, 'right');
      // s2 number
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.setTextColor(0, 0, 0);
      pdfDoc.text(this.s2, 135, 195, null, null, 'right');
      // line
      pdfDoc.line(10, 198, 135, 198);
      // developer link
      pdfDoc.setFontSize(10);
      pdfDoc.setFont('courier');
      pdfDoc.setFontType('regular');
      pdfDoc.setTextColor(0, 0, 0);
      pdfDoc.text('https://www.linkedin.com/in/randy-rebucas-1a896943/', 10, 205, null, null, 'left');

      pdfDoc.autoPrint();
      pdfDoc.output('dataurlnewwindow');
    });

  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
