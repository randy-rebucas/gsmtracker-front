import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-test-results',
  templateUrl: './test-results.component.html',
  styleUrls: ['./test-results.component.css']
})
export class TestResultsComponent
extends SecureComponent
implements OnInit, OnDestroy {
  onFileView: string;
  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration
    ) {
      super(authService, router, dialog, appconfig);
    }

  ngOnInit() {
    super.doInit();
    this.onFileView = 'grid';
  }

  onSwitchView($arg) {
    this.onFileView = $arg;
  }

  onUploadHandler(info) {
    console.log('fired Event "onUpload"');
    console.log(info);
  }

  onChangeHandler(file) {
    if (!file) {
      return;
    }
    console.log('fired Event "onChange"');
  // input file parameter depends on "multiple-files" widget attribute
    // if(this.multipleFiles) {
  //  file contains 2 methods:
  //  .promise() - returns the general promise for all uploaded files which resolves into an uploaded file group info
  //  .files() - returns an array of promises: one per each uploaded file. Each promise resolves into an uploaded file info
    console.log(file);
    if (file.promise) {
        file.promise().then((groupInfo) => {
          console.log('resolved general promise from "onChange" with data:');
          console.log(groupInfo);
        });
      }
    if (file.files) {
        file.files().forEach((promise) => {
          promise.then((fileInfo) => {
            console.log('resolves file promise with file info:');
            console.log(fileInfo);
          });
        });
      } else {
  // file contains uploaded file info
        console.log(file);
      }
    // }
  }

  onProgressHandler(progress) {
    console.log('fired Event "onProgress with data:"');
    console.log(progress);
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
