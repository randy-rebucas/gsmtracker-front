import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicianListComponent } from './technician-list/technician-list.component';
import { TechnicianFormComponent } from './technician-form/technician-form.component';
import { TechnicianLookupComponent } from './technician-lookup/technician-lookup.component';
import { TechnicianComponent } from './technician.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    TechnicianComponent,
    TechnicianListComponent,
    TechnicianFormComponent,
    TechnicianLookupComponent
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
      { path: '', component: TechnicianComponent }
    ])
  ],
  entryComponents: [
    TechnicianLookupComponent,
    TechnicianFormComponent
  ]
})
export class TechnicianModule { }
