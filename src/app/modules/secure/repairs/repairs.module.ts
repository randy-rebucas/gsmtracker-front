import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { RepairListComponent } from './repair-list/repair-list.component';
import { RepairFormComponent } from './repair-form/repair-form.component';
import { RepairsComponent } from './repairs.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';
import { CustomerFormComponent } from '../users/customer/customer-form/customer-form.component';
import { CustomerLookupComponent } from '../users/customer/customer-lookup/customer-lookup.component';


@NgModule({
  declarations: [
    RepairsComponent,
    RepairListComponent,
    RepairFormComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    SharedModule,
    FlexLayoutModule,
    RouterModule.forChild([
      { path: '', component: RepairsComponent, children: [
        { path: '', redirectTo: 'all', pathMatch: 'full' },
        { path: 'all', component: RepairListComponent },
        { path: 'list', component: RepairListComponent },
        { path: 'form', component: RepairFormComponent },
        { path: 'form/:formId', component: RepairFormComponent },
      ] }
    ])
  ],
  providers: [
    DatePipe,
    TitleCasePipe
  ],
  entryComponents: [
    CustomerFormComponent,
    CustomerLookupComponent
  ]
})
export class RepairsModule { }
