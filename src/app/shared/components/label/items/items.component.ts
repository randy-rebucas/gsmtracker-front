import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { LabelsService } from 'src/app/shared/services/labels.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit, OnDestroy {
  @Input() labelId: string;

  public labels: any;
  private subs = new SubSink();
  constructor(
    private labelsService: LabelsService
  ) { }

  ngOnInit(): void {
    this.subs.sink = this.labelsService.get(this.labelId).subscribe((label) => {
      this.labels = label;
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
