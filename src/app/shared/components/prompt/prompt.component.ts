import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements OnInit {
  message: string;
  title: string;

  constructor(
    public dialogRef: MatDialogRef<PromptComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit(): void {
  }

  closeDialog(state: boolean) {
    this.dialogRef.close(state);
  }
}
