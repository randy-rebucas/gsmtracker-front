import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PhysicalExamsComponent } from './physical-exams.component';
import { HeightComponent } from './height/height.component';
import { HeightListComponent } from './height/height-list/height-list.component';
import { HeightEditComponent } from './height/height-edit/height-edit.component';
import { WeightComponent } from './weight/weight.component';
import { WeightListComponent } from './weight/weight-list/weight-list.component';
import { WeightEditComponent } from './weight/weight-edit/weight-edit.component';
import { TemperatureComponent } from './vital-signs/temperature/temperature.component';
import { TemperatureListComponent } from './vital-signs/temperature/temperature-list/temperature-list.component';
import { TemperatureEditComponent } from './vital-signs/temperature/temperature-edit/temperature-edit.component';
import { BloodPressureComponent } from './vital-signs/blood-pressure/blood-pressure.component';
import { BloodPressureListComponent } from './vital-signs/blood-pressure/blood-pressure-list/blood-pressure-list.component';
import { BloodPressureEditComponent } from './vital-signs/blood-pressure/blood-pressure-edit/blood-pressure-edit.component';
import { RespiratoryRateComponent } from './vital-signs/respiratory-rate/respiratory-rate.component';
import { RespiratoryRateEditComponent } from './vital-signs/respiratory-rate/respiratory-rate-edit/respiratory-rate-edit.component';
import { RespiratoryRateListComponent } from './vital-signs/respiratory-rate/respiratory-rate-list/respiratory-rate-list.component';
import { VitalSignsComponent } from './vital-signs/vital-signs.component';
import { PulseRateComponent } from './vital-signs/pulse-rate/pulse-rate.component';
import { PulseRateListComponent } from './vital-signs/pulse-rate/pulse-rate-list/pulse-rate-list.component';
import { PulseRateEditComponent } from './vital-signs/pulse-rate/pulse-rate-edit/pulse-rate-edit.component';

@NgModule({
  declarations: [
    PhysicalExamsComponent,
    HeightComponent,
    HeightListComponent,
    HeightEditComponent,
    WeightComponent,
    WeightListComponent,
    WeightEditComponent,
    TemperatureComponent,
    TemperatureListComponent,
    TemperatureEditComponent,
    BloodPressureComponent,
    BloodPressureListComponent,
    BloodPressureEditComponent,
    RespiratoryRateComponent,
    RespiratoryRateListComponent,
    RespiratoryRateEditComponent,
    PulseRateComponent,
    PulseRateListComponent,
    PulseRateEditComponent,
    VitalSignsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
      { path: '', component: PhysicalExamsComponent, children: [
        { path: '', redirectTo: 'vital-signs', pathMatch: 'full' },
        { path: 'height', component: HeightComponent },
        { path: 'weight', component: WeightComponent },
        { path: 'vital-signs', component: VitalSignsComponent, children: [
          { path: '', redirectTo: 'temperature', pathMatch: 'full' },
          { path: 'temperature', component: TemperatureComponent },
          { path: 'blood-pressure', component: BloodPressureComponent },
          { path: 'respiratory-rate', component: RespiratoryRateComponent },
          { path: 'pulse-rate', component: PulseRateComponent }
        ] }
      ]}
    ])
  ],
  entryComponents: [
    HeightEditComponent,
    WeightEditComponent,
    TemperatureEditComponent,
    BloodPressureEditComponent,
    RespiratoryRateEditComponent,
    PulseRateEditComponent
  ]
})
export class PhysicalExamsModule {}
