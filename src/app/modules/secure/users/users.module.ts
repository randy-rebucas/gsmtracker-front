import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';



@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: UsersComponent, children: [
        { path: '', redirectTo: 'customers', pathMatch: 'full' },
        { path: 'customers', loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule) },
        { path: 'technicians', loadChildren: () => import('./technician/technician.module').then(m => m.TechnicianModule) },
      ] }
    ])
  ]
})
export class UsersModule { }
