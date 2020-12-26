import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LabelsService } from '../../services/labels.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { SubSink } from 'subsink';


@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public dialogTitle: string;
  public dialogButton: string;
  public labelId: string;
  public userId: string;
  @ViewChild('labelInput', {static: true}) labelInput: any;

  private subs = new SubSink();
  constructor(
    private authenticationService: AuthenticationService,
    private labelsService: LabelsService,
    public dialogRef: MatDialogRef < LabelComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.dialogTitle = data.title;
    this.dialogButton = data.btn;
    this.labelId = data.id;
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit(): void {
    this.labelInput.nativeElement.focus();

    if (this.labelId) {
      this.subs.sink = this.labelsService.get(this.labelId).subscribe(res => {
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

    const updatePatient = {
      ...newLabel, ...{
        _id: this.labelId,
      }
    };

    if (!this.labelId) {
      this.subs.sink = this.labelsService.insert(newLabel).subscribe((res) => {
        this.form.reset();
        this.dialogRef.close('new');
      });
    } else {
      this.subs.sink = this.labelsService.update(updatePatient).subscribe(() => {
        this.form.reset();
        this.dialogRef.close('update');
      });
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
