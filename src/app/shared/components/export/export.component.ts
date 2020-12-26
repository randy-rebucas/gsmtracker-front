import { Component, OnInit, Inject, OnDestroy, LOCALE_ID, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Settings } from '../../interfaces/settings';
import { LabelsService } from '../../services/labels.service';
import { SettingsService } from '../../services/settings.service';
import { UploadService } from '../../services/upload.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { RepairsService } from 'src/app/modules/secure/repairs/repairs.service';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { CurrencyPipe, DatePipe, formatCurrency, getCurrencySymbol } from '@angular/common';
import { SubSink } from 'subsink';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit, OnDestroy, AfterViewInit {
  selectedOption: string;
  userId: string;
  labels: any[];
  setting: Settings;
  imagePath: any;
  settingsData: any;
  items: any;
  itemCount: number;
  optionPicked: string;
  dialogTitle: string;
  selectedCurrency: string;
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
    private currencyPipe: CurrencyPipe,
    private labelsService: LabelsService,
    private settingsService: SettingsService,
    private uploadService: UploadService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private repairsService: RepairsService,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef < ExportComponent >,
    @Inject(LOCALE_ID) private locale: string,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.dialogTitle = data.title;
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
    this.subs.sink = this.labelsService.getLabels()
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
      console.log(settingResponse);
      this.selectedCurrency = settingResponse.currency;
    });
  }

  onChangeOption(event: MatRadioChange) {
    this.optionPicked = event.value;
    this.selectedOption = (event.value === 'option') ? 'my-repair' : '';
  }

  doExport(repairs: any) {
    const csvOptions = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      title: this.innerRepair,
      useBom: true,
      noDownload: false,
      headers: [
        this.innerCustomer,
        this.innerPhone,
        this.innerWarranty,
        this.innerAmount,
        this.innerTechnician,
        this.innerCreated
      ]
    };

    const repairList = [];
    for (const iterator of repairs) {
      // console.log(iterator);
      const phoneBrand = iterator.phoneInfo.brand;
      const phoneModel = iterator.phoneInfo.model;
      const dataObj = {
        customerName: iterator.customer,
        phone: phoneModel.concat(', ', phoneBrand),
        warranty: iterator.warranty,
        technician: iterator.technician,
        amountPaid: formatCurrency(iterator.amountPaid, this.locale, getCurrencySymbol(this.selectedCurrency, 'narrow')),
        created: this.datePipe.transform(iterator.created, 'yyyy-MM-dd'),
      };
      repairList.push(dataObj);
    }
    // tslint:disable-next-line: no-unused-expression
    new AngularCsv(repairList, 'Repairs', csvOptions);
  }

  onExport() {
    if (this.optionPicked === 'selected') {
      this.doExport(this.items);
    } else {
      // set label filter
      const hasLabel = (this.selectedOption !== 'my-repair') ? this.selectedOption : '';
      this.repairsService.getAll(null, null, hasLabel, this.userId);
      this.subs.sink = this.repairsService.getUpdateListener().subscribe((repair) => {
        this.doExport(repair.repairs);
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
