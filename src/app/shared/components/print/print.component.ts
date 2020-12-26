import { Component, OnInit, OnDestroy, Inject, AfterViewInit, LOCALE_ID } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DatePipe, formatCurrency, getCurrencySymbol } from '@angular/common';
import * as jsPDF from 'jspdf';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';

import { SettingsService } from '../../services/settings.service';
import { LabelsService } from '../../services/labels.service';
import { UploadService } from '../../services/upload.service';
import { Settings } from '../../interfaces/settings';
import { RepairsService } from 'src/app/modules/secure/repairs/repairs.service';
import { SubSink } from 'subsink';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit, OnDestroy, AfterViewInit {
  selectedOption: string;
  userId: string;
  labelsSub: Subscription;
  labels: any[];
  setting: Settings;
  imagePath: any;
  settingsData: any;
  items: any;
  title: string;
  itemCount: number;
  optionPicked: string;
  selectedCurrency: string;
  currencySymbolBase64: any;
  shopName: string;
  shopOwner: string;
  shopLogo: string;
  innerMyRepair: string;
  innerRepair: string;
  innerCustomer: string;
  innerPhone: string;
  innerTechnician: string;
  innerCreated: string;
  innerWarranty: string;
  innerAmount: any;

  private subs = new SubSink();
  constructor(
    private labelsService: LabelsService,
    private settingsService: SettingsService,
    private uploadService: UploadService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private repairsService: RepairsService,
    public dialogRef: MatDialogRef < PrintComponent >,
    @Inject(LOCALE_ID) private locale: string,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.items = data.selectedItem;
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit(): void {
    this.subs.sink = this.translate.get([
      'repairs.my-repairs',
      'repairs.title',
      'customers.title',
      'basic.phone',
      'technicians.title',
      'basic.created',
      'repairs.warranty',
      'repairs.amount-paid'
    ])
    .subscribe(translat => {
      this.innerMyRepair = translat['repairs.my-repairs'];
      this.innerRepair = translat['repairs.title'];
      this.innerCustomer = translat['customers.title'];
      this.innerPhone = translat['basic.phone'];
      this.innerWarranty = translat['repairs.warranty'];
      this.innerAmount = translat['repairs.amount-paid'];
      this.innerTechnician = translat['technicians.title'];
      this.innerCreated = translat['basic.created'];
    });

    // set option
    this.optionPicked = (this.items) ? 'selected' : 'option';
    // count selected items
    this.itemCount = (this.items) ? this.items.length : 0;
    // set selection
    this.selectedOption = (this.items) ? '' : 'my-repair';

    this.labelsService.getAll(this.userId);
    this.subs.sink = this.labelsSub = this.labelsService.getLabels()
      .subscribe((res) => {
      this.labels = res.labels;
    });
  }

  ngAfterViewInit() {
    this.settingsService.getSetting(this.userId);
    this.subs.sink = this.settingsService.getSettingListener()
    .pipe(
      switchMap(setting => {
        this.setting = setting;
        return this.uploadService.get(setting._id);
      })
    )
    .subscribe((mergeRes) => {
      const settingResponse = { ...this.setting, ...mergeRes };
      // city: "Bulqize"
      // country: "Philippines"
      // currency: "PHP"
      // image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD"
      // language: "en"
      // shopName: "Q-technicians"
      // shopOwner: "Randy"
      // state: "Bulqize"
      // updates: true
      // userId: "5ea13d8bae18c90fcc83c774"
      this.shopName = settingResponse.shopName;
      this.shopOwner = settingResponse.shopOwner;
      this.shopLogo = settingResponse.image;
      this.selectedCurrency = settingResponse.currency;
      let currencySymbol;
      switch (settingResponse.currency) {
        case 'USD':
          currencySymbol = '/assets/images/currencies/dollar.png';
          break;
        case 'SAR':
          currencySymbol = '/assets/images/currencies/india-rupee.png';
          break;
        default:
          currencySymbol = '/assets/images/currencies/php.png';
          break;
      }

      this.convertToBase64(currencySymbol, (responseBase64) => {
        this.currencySymbolBase64 = responseBase64;
      });
    });
  }

  convertToBase64(imageSelected: any, callback) {
    const request = new
    XMLHttpRequest();
    request.onload = () => {
      const file = new FileReader();
      file.onloadend = () => {
        callback(file.result);
      };
      file.readAsDataURL(request.response);
    };
    request.open('GET', imageSelected);
    request.responseType = 'blob';
    request.send();
  }

  doPrint(repair: any) {
    // console.log(repair);
    const datePipe = new DatePipe('en-US');
    const pdfDoc = new jsPDF('p', 'mm', 'a4');
    const pageHeight = pdfDoc.internal.pageSize.height || pdfDoc.internal.pageSize.getHeight();
    const pageWidth = pdfDoc.internal.pageSize.width || pdfDoc.internal.pageSize.getWidth();
    // clinic owner
    pdfDoc.setFontSize(16);
    pdfDoc.setFont('normal');
    pdfDoc.addImage(this.shopLogo, 'PNG', 10, 8, 18, 18);
    pdfDoc.text(this.shopName, 35, 15, null, null, 'left');

    pdfDoc.setFontSize(14);
    pdfDoc.setFont('normal');
    pdfDoc.text(this.shopOwner, 35, 22, null, null, 'left');

    pdfDoc.line(10, 28, 200, 28);
    pdfDoc.setFontSize(12);
    pdfDoc.setFont('courier');
    pdfDoc.text(this.innerCustomer, 10, 32, null, null, 'left');
    pdfDoc.text(this.innerPhone, 50, 32, null, null, 'left');
    pdfDoc.text(this.innerWarranty, 80, 32, null, null, 'left');
    pdfDoc.text(this.innerAmount, 105, 32, null, null, 'left');
    pdfDoc.text(this.innerTechnician, 140, 32, null, null, 'left');
    pdfDoc.text(this.innerCreated, 175, 32, null, null, 'left');

    pdfDoc.setFontSize(10);
    pdfDoc.setFont('courier');

    for (let index = 0; index < repair.length; index++) {
      const element = repair[index];
      const phoneBrand = element.phoneInfo.brand;
      const phoneModel = element.phoneInfo.model;
      pdfDoc.text(element.customer, 10, 37 + (index * 8), null, null, 'left');
      pdfDoc.text(phoneModel.concat(', ', phoneBrand), 50, 37 + (index * 8), null, null, 'left');
      pdfDoc.text(element.warranty, 80, 37 + (index * 8), null, null, 'left');
      pdfDoc.addImage(this.currencySymbolBase64, 'PNG', 105, 36 + (index * 8), 2, 2);
      pdfDoc.text('' + element.amountPaid + '.00',
      132, 37 + (index * 8), null, null, 'right');
      // pdfDoc.text(
      //   formatCurrency(element.amountPaid, this.locale, getCurrencySymbol(this.selectedCurrency, 'narrow')),
      // 135, 37 + (index * 8), null, null, 'right');
      pdfDoc.text(element.technician, 140, 37 + (index * 8), null, null, 'left');
      pdfDoc.text(datePipe.transform(element.created, 'MMM dd, yyyy'), 175, 37 + (index * 8), null, null, 'left');
    }
    pdfDoc.autoPrint();
    pdfDoc.output('dataurlnewwindow');
  }

  onChangeOption(event: MatRadioChange) {
    this.optionPicked = event.value;
    this.selectedOption = (event.value === 'option') ? 'my-repair' : '';
  }

  onPrint() {
    if (this.optionPicked === 'selected') {
      this.doPrint(this.items);
    } else {
      // set label filter
      const hasLabel = (this.selectedOption !== 'my-repair') ? this.selectedOption : '';
      this.repairsService.getAll(null, null, hasLabel, this.userId);
      this.subs.sink = this.repairsService.getUpdateListener().subscribe((repair) => {
        this.doPrint(repair.repairs);
      });
    }
  }

  filterLabel(label: MatSelectChange) {
    this.selectedOption = label.value;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
