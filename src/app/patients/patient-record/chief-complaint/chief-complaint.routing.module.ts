import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../auth/auth-guard';
import { ChiefComplaintComponent } from './chief-complaint.component';
import { ChiefComplaintListComponent } from './chief-complaint-list/chief-complaint-list.component';
import { ChiefComplaintDetailComponent } from './chief-complaint-detail/chief-complaint-detail.component';
import { AssessmentListComponent } from '../assessments/assessment-list/assessment-list.component';
import { PrescriptionsComponent } from '../prescriptions/prescriptions.component';
import { PrescriptionListComponent } from '../prescriptions/prescription-list/prescription-list.component';


const routes: Routes = [
    { path: '', component: ChiefComplaintComponent, canActivate: [AuthGuard], children: [
      { path: '', component: ChiefComplaintListComponent },
      { path: ':complaintId', component: ChiefComplaintDetailComponent, children: [
        { path: '', component: AssessmentListComponent }, //change component filtered by complaint id
        { path: 'prescription', component: PrescriptionsComponent, children: [
          { path: '', component: PrescriptionListComponent },
          { path: ':precriptionId', component: PrescriptionListComponent } //prescription detail
        ] },
      ] },
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ChiefComplaintRoutingModule {}
