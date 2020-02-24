import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  fileReaded: File;
  form: FormGroup;
  constructor() { }

  ngOnInit(): void {

    this.form = new FormGroup({
      file: new FormControl(null, {validators: [Validators.required]})
    });
  }

  onImport() {
    if (this.form.invalid) {
      return;
    }

    console.log(this.form.value.file);
    // this.form.value.file;
  }
// csvtojson
// jsontocsv
}
