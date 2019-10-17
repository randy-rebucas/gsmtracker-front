import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';
import { UsersComponent } from './users.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { EditorModule } from '@tinymce/tinymce-angular';
import { RecordModule } from '../shared/record/record.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthGuard } from '../auth/auth-guard';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ListComponent } from './list/list.component';
import { RecordComponent } from './record/record.component';
import { DetailComponent } from './detail/detail.component';
import { UserFormComponent } from './user-form/user-form.component';


@NgModule({
  declarations: [
    UsersComponent,
    UserListComponent,
    UserDetailComponent,
    ListComponent,
    DetailComponent,
    RecordComponent,
    UserFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    PerfectScrollbarModule,
    FormsModule,
    EditorModule,
    RecordModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
      { path: '', component: UsersComponent, canActivate: [AuthGuard], children: [
        { path: '', redirectTo: 'all', pathMatch: 'full' },
        { path: ':userType', component: ListComponent, children: [
          { path: '', component: UserListComponent },
          { path: ':userId', component: DetailComponent, children: [
            { path: '', redirectTo: 'detail', pathMatch: 'full' },
            { path: 'detail', component: UserDetailComponent },
            { path: 'record', component: RecordComponent, children: [
              { path: '', redirectTo: 'chief-complaints', pathMatch: 'full' },
              { path: 'chief-complaints', loadChildren: './record/chief-complaint/chief-complaint.module#ChiefComplaintModule'},
              { path: 'histories', loadChildren: './record/histories/histories.module#HistoriesModule'},
              { path: 'physical-exams', loadChildren: './record/physical-exams/physical-exams.module#PhysicalExamsModule'},
              { path: 'orders', loadChildren: './record/orders/orders.module#OrdersModule'},
              { path: 'prescriptions', loadChildren: './record/prescriptions/prescriptions.module#PrescriptionsModule'},
              { path: 'test-results', loadChildren: './record/test-results/test-result.module#TestResultModule'},
              { path: 'progress-notes', loadChildren: './record/progress-notes/progress-notes.module#ProgressNotesModule'},
              { path: 'assessments', loadChildren: './record/assessments/assessments.module#AssessmentsModule'},
              { path: 'immunizations', loadChildren: './record/immunization/immunization.module#ImmunizationModule'},
            ] },
          ] }
        ] }
      ] }
    ])
  ],
  entryComponents: [
    UserFormComponent
  ]
})
export class UsersModule {}
