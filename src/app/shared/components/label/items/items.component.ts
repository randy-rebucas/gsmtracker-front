import { Component, OnInit, Input } from '@angular/core';
import { LabelsService } from 'src/app/shared/services/labels.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  @Input() labelId: string;

  labels: any;
  constructor(
    private labelsService: LabelsService
  ) { }

  ngOnInit(): void {
    this.labelsService.get(this.labelId).subscribe((label) => {
      this.labels = label;
    });
  }

}
