import { BrowserModule, Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
// import { FlexLayoutModule } from '@angular/flex-layout/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';

import { AppComponent } from './app.component';
import { AppConfiguration } from './app-configuration.service';
import { MainNavComponent } from './main-nav/main-nav.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './angular-material.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { HomeComponent } from './home/home.component';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsComponent } from './appointments/appointments.component';
import { SettingsComponent } from './settings/settings.component';
// import { ProfileComponent } from './settings/profile/profile.component';
import { ClinicComponent } from './settings/clinic/clinic.component';
import { NotificationComponent } from './settings/notification/notification.component';
import { MatDialogConfirmComponent } from './mat-dialog-confirm/mat-dialog-confirm.component';
import { PatientRecordsModule } from './patients/patient-record/patient-records.module';
import { PatientEditComponent } from './patients/patient-edit/patient-edit.component';
import { HeightEditComponent } from './patients/patient-record/physical-exams/height/height-edit/height-edit.component';
import { WeightEditComponent } from './patients/patient-record/physical-exams/weight/weight-edit/weight-edit.component';
import { TemperatureEditComponent } from './patients/patient-record/physical-exams/temperature/temperature-edit/temperature-edit.component';
import { BloodPressureEditComponent } from './patients/patient-record/physical-exams/blood-pressure/blood-pressure-edit/blood-pressure-edit.component';
import { RespiratoryRateEditComponent } from './patients/patient-record/physical-exams/respiratory-rate/respiratory-rate-edit/respiratory-rate-edit.component';
import { ChiefComplaintEditComponent } from './patients/patient-record/chief-complaint/chief-complaint-edit/chief-complaint-edit.component';
import { AssessmentEditComponent } from './patients/patient-record/assessments/assessment-edit/assetment-edit.component';
import { PrescriptionEditComponent } from './patients/patient-record/prescriptions/prescription-edit/prescription-edit.component';
import { ProgressNoteEditComponent } from './patients/patient-record/progress-notes/progress-note-edit/progress-note-edit.component';
import { EncounterEditComponent } from './patients/patient-record/encounters/encounter-edit/encounter-edit.component';
import { RxPadComponent } from './rx-pad/rx-pad.component';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { QrCodeGenerateComponent } from './qr-code/qr-code-generate/qr-code-generate.component';
import { QrCodeScannerComponent } from './qr-code/qr-code-scanner/qr-code-scanner.component';
import { AppointmentEditComponent } from './appointments/appointment-edit/appointment-edit.component';
import { AppointmentListComponent } from './appointments/appointment-list/appointment-list.component';
import { AppointmentCalendarComponent } from './appointments/appointment-calendar/appointment-calendar.component';
import { PatientChartComponent } from './patients/patient-chart/patient-chart.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageListComponent } from './messages/message-list/message-list.component';
import { MessageEditComponent } from './messages/message-edit/message-edit.component';
import { MessageInitialComponent } from './messages/message-initial/message-initial.component';
import { MessageDetailComponent } from './messages/message-detail/message-detail.component';
import { DialogComponent } from './upload/dialog/dialog.component';
import { UploadService } from './upload/upload.service';
import { UploadModule } from './upload/upload.module';

import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRCodeModule } from 'angularx-qrcode';
import { WebcamModule } from 'ngx-webcam';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxPrintModule } from 'ngx-print';
import { LayoutModule } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import { AppointmentDetailComponent } from './appointments/appointment-detail/appointment-detail.component';
import { SecureComponent } from './secure/secure.component';
import { TestResultEditComponent } from './patients/patient-record/test-results/test-result-edit/test-result-edit.component';
import { ProfileImageComponent } from './upload/profile-image/profile-image.component';
import { UsersModule } from './users/users.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { QueComponent } from './que/que.component';

// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { StatModule } from './shared/stat/stat.module';
import { ChartsModule } from 'ng2-charts';
import { EditorModule } from '@tinymce/tinymce-angular';
import { HistoriesModule } from './patients/patient-record/histories/histories.module';
import { SettingsModule } from './settings/settings.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

// AoT requires an exported function for factories
export const createTranslateLoader = (http: HttpClient) => {
  /* for development
  return new TranslateHttpLoader(
      http,
      '/start-javascript/sb-admin-material/master/dist/assets/i18n/',
      '.json'
  );*/
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    ErrorComponent,
    PageNotFoundComponent,
    HomeComponent,
    AppointmentsComponent,
    AppointmentEditComponent,
    AppointmentListComponent,
    AppointmentDetailComponent,
    AppointmentCalendarComponent,
    RxPadComponent,
    QrCodeComponent,
    QrCodeScannerComponent,
    QrCodeGenerateComponent,
    SettingsComponent,
    // ProfileComponent,
    ClinicComponent,
    NotificationComponent,
    MessagesComponent,
    MessageListComponent,
    MessageEditComponent,
    MessageInitialComponent,
    MessageDetailComponent,
    MatDialogConfirmComponent,
    DialogComponent,
    SecureComponent,
    QueComponent,
    ProfileImageComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    LayoutModule,
    OverlayModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    PatientsModule,
    UsersModule,
    PatientRecordsModule,
    SettingsModule,
    StatModule,
    HistoriesModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    NgxMaterialTimepickerModule,
    NgxPrintModule,
    ZXingScannerModule,
    QRCodeModule,
    UploadModule,
    FullCalendarModule,
    ChartsModule,
    WebcamModule,
    PerfectScrollbarModule,
    EditorModule
  ],
  providers: [
    AppConfiguration,
    UploadService,
    {
        provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
        provide: APP_INITIALIZER,
        useFactory: AppConfigurationFactory,
        deps: [AppConfiguration, HttpClient], multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    DatePipe,
    Title
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ErrorComponent,
    MatDialogConfirmComponent,
    PatientEditComponent,
    HeightEditComponent,
    WeightEditComponent,
    TemperatureEditComponent,
    BloodPressureEditComponent,
    RespiratoryRateEditComponent,
    ChiefComplaintEditComponent,
    AssessmentEditComponent,
    PrescriptionEditComponent,
    ProgressNoteEditComponent,
    EncounterEditComponent,
    QrCodeGenerateComponent,
    AppointmentEditComponent,
    PatientChartComponent,
    MessageEditComponent,
    DialogComponent,
    RxPadComponent,
    AppointmentDetailComponent,
    QrCodeScannerComponent,
    TestResultEditComponent,
    ProfileImageComponent
  ]
})
export class AppModule { }

export function AppConfigurationFactory( appConfig: AppConfiguration ) {
    return () => appConfig.ensureInit();
}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
