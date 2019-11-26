import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PatientsComponent } from './patients.component';
import { AuthenticationGuard } from '../authentication/authentication.guard';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import {
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatListModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatCheckboxModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDialogModule,
  MatProgressBarModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BirthdaysComponent } from 'src/app/shared/components/birthdays/birthdays.component';
import { PhysiciansComponent } from 'src/app/shared/components/physicians/physicians.component';
import { BirthdayPipe } from 'src/app/shared/pipes/birthday.pipe';
import { AvatarModule } from 'ngx-avatar';

@NgModule({
  declarations: [
    PatientsComponent,
    PatientListComponent,
    PatientFormComponent,
    PatientDetailComponent,
    BirthdaysComponent,
    PhysiciansComponent,
    BirthdayPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    AvatarModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
      { path: '', component: PatientsComponent, children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', component: PatientListComponent },
        { path: 'form', component: PatientFormComponent, canActivate: [AuthenticationGuard] },
        { path: ':patientId', component: PatientDetailComponent },
        { path: ':patientId/edit', component: PatientFormComponent, canActivate: [AuthenticationGuard]  }
      ] }
    ])
  ],
  entryComponents: [
    PatientFormComponent
  ]
})
export class PatientsModule { }
