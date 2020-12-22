import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
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
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit, OnDestroy {
  selectedOption: string;
  userId: string;
  labelsSub: Subscription;
  labels: any[];
  setting: Settings;
  imagePath: any;
  settingsData: any;
  items: any;
  itemCount: number;
  optionPicked: string;
  title: string;

  constructor(
    private labelsService: LabelsService,
    private settingsService: SettingsService,
    private uploadService: UploadService,
    private authenticationService: AuthenticationService,
    private repairsService: RepairsService,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef < ExportComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.items = data.selectedItem;
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit(): void {
    // set option
    this.optionPicked = (this.items) ? 'selected' : 'option';
    // count selected items
    this.itemCount = (this.items) ? this.items.length : 0;
    // set selection
    this.selectedOption = (this.items) ? '' : 'my-repair';

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

  onChangeOption(event: MatRadioChange) {
    this.optionPicked = event.value;
    this.selectedOption = (event.value === 'option') ? 'my-repair' : '';
  }

  doExport(patients: any) {
    const csvOptions = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      title: 'Patients',
      useBom: true,
      noDownload: false,
      headers: [
        'Firstname',
        'Midlename',
        'Lastname',
        'Contact',
        'Gender',
        'Birthdate',
        'Created',
        'Address',
        'City',
        'Province',
        'Country',
        'Postal'
      ]
    };

    const repairList = [];
    for (const iterator of patients) {
      const dataObj = {
        fullname: iterator.firstname,
        midlename: iterator.midlename,
        lastname: iterator.lastname,
        contact: iterator.contact,
        gender: iterator.gender,
        birthdate: this.datePipe.transform(iterator.birthdate, 'yyyy-MM-dd'),
        created: this.datePipe.transform(iterator.created, 'yyyy-MM-dd')
      };

      let addressObj = {};
      if (iterator.address.length > 1 ) {
        iterator.address.forEach(el => {
          if (el.current) {
            addressObj = {
              address: el.address1 + ' ' + el.address2,
              city: el.city,
              province: el.province,
              country: el.country,
              postalCode: el.postalCode
            };
          }
        });
      } else {
        addressObj = {
          address: iterator.address[0].address1 + ' ' + iterator.address[0].address2,
          city: iterator.address[0].city,
          province: iterator.address[0].province,
          country: iterator.address[0].country,
          postalCode: iterator.address[0].postalCode
        };
      }

      const mergeObj = {...dataObj, ...addressObj};

      repairList.push(mergeObj);
    }
    // tslint:disable-next-line: no-unused-expression
    new AngularCsv(repairList, 'Repair', csvOptions);
  }

  onExport() {
    if (this.optionPicked === 'selected') {
      this.doExport(this.items);
    } else {
      // set label filter
      const hasLabel = (this.selectedOption !== 'my-repair') ? this.selectedOption : '';
      this.repairsService.getAll(null, null, hasLabel, this.userId);
      this.repairsService.getUpdateListener().subscribe((repair) => {
        this.doExport(repair.repairs);
      });
    }
  }

  filterLabel(label: MatSelectChange) {
    this.selectedOption = label.value;
  }

  ngOnDestroy() {
    this.labelsSub.unsubscribe();
  }
}
