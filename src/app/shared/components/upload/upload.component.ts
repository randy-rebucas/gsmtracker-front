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
  @Input() imagePreview: ArrayBuffer | any;
  @Input() defaultImage: string;
  @Input() size: number;

  form: FormGroup;
  loadingPic: boolean;
  bufferValue: number;
  color: string;
  mode: string;
  selectedFile: File = null;

  constructor(
    private uploadService: UploadService,
    private notificationService: NotificationService
  ) {
    this.loadingPic = false;
    this.defaultImage = './../../../../assets/images/blank.png';
  }

  ngOnInit() {
    if (!this.size) {
      this.size = 200;
    }
    this.form = new FormGroup({
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mime]
      })
    });

    this.uploadService.getProfilePicture().subscribe((image) => {
      this.imagePreview = image;
    });
  }

  onFileChanged(event: Event) {
    this.loadingPic = true;
    this.selectedFile = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      this.uploadService.upload(
        this.sourceId,
        reader.result
      ).subscribe((e) => {
        if (e.type === HttpEventType.UploadProgress) {
          this.bufferValue = Math.round(e.loaded / e.total * 100);
          this.color = 'primary';
          this.mode = 'determinate';
        } else if (e.type === HttpEventType.Response) {
          this.loadingPic = false;
          this.uploadService.setProfilePic(e.body.imagePath);
          this.notificationService.success(':: ' + e.body.message);
        }
      });
    };
    reader.readAsDataURL(this.selectedFile);
  }

}
