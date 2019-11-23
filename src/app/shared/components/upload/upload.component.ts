import { Component, OnInit, Input } from '@angular/core';
import { mime } from '../../validators/mime-validator';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { UploadService } from '../../services/upload.service';
import { HttpEventType } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  @Input() sourceId: string;
  @Input() imagePath: string;

  form: FormGroup;
  loadingPic: boolean;
  bufferValue: number;
  color: string;
  mode: string;
  selectedFile: File = null;
  imagePreview: string;

  constructor(
    private uploadService: UploadService,
    private notificationService: NotificationService
  ) {
    this.loadingPic = false;
  }

  ngOnInit() {
    console.log(this.sourceId);
    this.form = new FormGroup({
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mime]
      })
    });
    if (this.imagePath) {
      this.imagePreview = this.imagePath;
    }

  }

  onFileChanged(event: Event) {
    this.selectedFile = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: this.selectedFile });
    this.loadingPic = true;
    this.onUpload();
  }

  onUpload() {
    this.uploadService.upload(
      this.sourceId,
      this.form.value.image
    ).subscribe((event) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.bufferValue = Math.round(event.loaded / event.total * 100);
        this.color = 'primary';
        this.mode = 'determinate';
      } else if (event.type === HttpEventType.Response) {
        this.loadingPic = false;
        this.imagePreview = event.body.imagePath;
        this.notificationService.success(':: ' + event.body.message);
      }
    });
  }
}
