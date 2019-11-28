import { Component, OnInit } from '@angular/core';
import { PlansService } from 'src/app/shared/services/plans.service';

export interface PlanItems {
  quantity: number;
  item: string;
  unitPrice: number;
}

const PLAN_DATA: PlanItems[] = [
  {quantity: 1, item: 'set pc', unitPrice: 35000},
  {quantity: 1, item: 'printer', unitPrice: 8000},
];

export interface Plans {
  name: string;
  slug: string;
  packages: [];
}
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
  public subscribed: boolean;
  public plans: any;

  planColumns: string[] = ['quantity', 'item', 'price'];
  planSource = PLAN_DATA;

  constructor(
    private planService: PlansService
  ) {
    this.subscribed = false;
   }

  ngOnInit() {

    this.planService.getAll().subscribe((subscriptions: {plans: Plans[]}) => {
      console.log(subscriptions.plans);
      this.plans = subscriptions.plans;
    });
  }

}
