import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-qr-writer',
  templateUrl: './qr-writer.component.html',
  styleUrls: ['./qr-writer.component.scss']
})
export class QrWriterComponent implements OnInit {
  title: string;
  id: string;

  constructor(
    public dialogRef: MatDialogRef < QrWriterComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.id = data.id;
  }

  ngOnInit(): void {
  }

  onDownload() {

  }

  onShare() {

  }
}
