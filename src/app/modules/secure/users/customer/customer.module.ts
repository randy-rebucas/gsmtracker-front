import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerLookupComponent } from './customer-lookup/customer-lookup.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { CustomerComponent } from './customer.component';



@NgModule({
  declarations: [
    CustomerComponent,
    CustomerListComponent,
    CustomerFormComponent,
    CustomerLookupComponent
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
      { path: '', component: CustomerComponent, children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', component: CustomerListComponent },
        { path: 'form', component: CustomerFormComponent },
      ] }
    ])
  ],
  entryComponents: [
    CustomerLookupComponent
  ]
})
export class CustomerModule { }
