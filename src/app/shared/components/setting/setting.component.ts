import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  selected = 'en';

  public form: FormGroup;
  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      rxheader: new FormControl(null, {validators: [Validators.required]}),
      language: new FormControl(null, {validators: [Validators.required]}),
      appointments: new FormControl(null, {validators: [Validators.required]}),
      updates: new FormControl(null, {validators: [Validators.required]})
    });
  }

  onUpdateSetting() {

  }
}
