import { Component, OnInit } from '@angular/core';


export interface PaymantHistory {
  date: Date;
  status: string;
  amount: number;
}

const PAYMENT_HISTORY: PaymantHistory[] = [
  {date: new Date('2019-09-09'), status: 'Succeeded', amount: 5000}
];
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  paymentHistoryColumns: string[] = ['date', 'status', 'amount', 'action'];
  paymentSource = PAYMENT_HISTORY;

  constructor() { }

  ngOnInit() {
  }

}
