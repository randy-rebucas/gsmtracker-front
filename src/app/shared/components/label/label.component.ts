import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LabelsService } from '../../services/labels.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';

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

  @ViewChild('labelInput', {static: true}) labelInput: any;

  constructor(
    private authenticationService: AuthenticationService,
    private labelsService: LabelsService,
    public dialogRef: MatDialogRef < LabelComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.btn = (data.id) ? 'Update' : 'Save';
    this.labelId = data.id;
  }

  ngOnInit(): void {
    this.labelInput.nativeElement.focus();

    if (this.labelId) {
      this.labelsService.get(this.labelId).subscribe(res => {
        this.form.patchValue({
          label: res.label,
        });
      });
    }

    this.form = new FormGroup({
      label: new FormControl(null, {validators: [Validators.required, Validators.maxLength(150)]})
    });
  }

  onCreate() {
    if (this.form.invalid) {
      return;
    }

    const newLabel = {
      userId: this.authenticationService.getUserId(),
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
