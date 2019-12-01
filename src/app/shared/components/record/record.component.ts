import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {
  @Input() patientId: string;
  @Input() formProperties: any;

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    console.log(this.formProperties.slug);
    this.form = this.fb.group({
      firstname: ['', [Validators.required]],
      midlename: ['', [Validators.required]]
    });
    // console.log(this.patientId);
  }

  onSubmit() {
    console.log('submited');
  }

  onViewAll() {
    console.log('view all');
  }
}
