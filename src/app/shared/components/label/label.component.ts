import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LabelsService } from '../../services/labels.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from 'src/app/modules/secure/settings/settings.service';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {
  form: FormGroup;
  title: string;
  labelId: string;
  btn: string;
  setting: any;
  userId: string;
  @ViewChild('labelInput', {static: true}) labelInput: any;

  constructor(
    private translate: TranslateService,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService,
    private labelsService: LabelsService,
    public dialogRef: MatDialogRef < LabelComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.btn = data.btn;
    this.labelId = data.id;
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit(): void {
    this.labelInput.nativeElement.focus();

    this.settingsService.getSetting(this.userId);
    this.settingsService.getSettingListener()
    .subscribe((setting) => {
      this.translate.use(setting.language);
      this.setting = setting;
    });

    if (this.labelId) {
      this.labelsService.get(this.labelId).subscribe(res => {
        this.form.patchValue({
          label: res.label,
        });
      });
    }

    this.form = new FormGroup({
      label: new FormControl(null, {validators: [Validators.required, Validators.maxLength(50)]})
    });
  }

  get formCtrls() { return this.form.controls; }

  onCreate() {
    if (this.form.invalid) {
      return;
    }

    const newLabel = {
      userId: this.userId,
      label: this.form.value.label
    };

    const labelId = {
      _id: this.labelId,
    };

    const updatePatient = {
      ...newLabel, ...labelId
    };

    if (!this.labelId) {
      this.labelsService.insert(newLabel).subscribe((res) => {
        this.form.reset();
        this.dialogRef.close('new');
      });
    } else {
      this.labelsService.update(updatePatient).subscribe(() => {
        this.form.reset();
        this.dialogRef.close('update');
      });
    }
  }
}