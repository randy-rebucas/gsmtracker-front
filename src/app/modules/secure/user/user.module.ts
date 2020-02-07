import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', redirectTo: 'patients', pathMatch: 'full' },
      { path: 'patients', loadChildren: () => import('./patients/patients.module').then(m => m.PatientsModule) },
      { path: 'physicians', loadChildren: () => import('./physicians/physicians.module').then(m => m.PhysiciansModule) }
    ])
  ]
})
export class UserModule { }
