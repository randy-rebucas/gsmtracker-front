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
import { PatientListComponent } from '../patients/patient-list/patient-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ListComponent } from './list/list.component';
import { RecordComponent } from './record/record.component';
import { DetailComponent } from './detail/detail.component';
import { SampleComponent } from './record/sample/sample.component';


@NgModule({
  declarations: [
    UsersComponent,
    UserListComponent,
    PatientListComponent,
    UserDetailComponent,
    ListComponent,
    DetailComponent,
    RecordComponent,
    SampleComponent
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
              { path: '', redirectTo: 'sample', pathMatch: 'full' },
              { path: 'sample', component: SampleComponent }
            ] },
          ] }
        ] }
      ] }
    ])
  ],
  // entryComponents: [
  //   PatientEditComponent
  // ]
})
export class UsersModule {}
