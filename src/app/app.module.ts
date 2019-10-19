import { BrowserModule, Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
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
import { MatDialogConfirmComponent } from './mat-dialog-confirm/mat-dialog-confirm.component';
import { RxPadComponent } from './rx-pad/rx-pad.component';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { QrCodeGenerateComponent } from './qr-code/qr-code-generate/qr-code-generate.component';
import { QrCodeScannerComponent } from './qr-code/qr-code-scanner/qr-code-scanner.component';

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

import { SecureComponent } from './secure/secure.component';
import { ImageComponent } from './upload/image/image.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { QueComponent } from './que/que.component';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StatModule } from './shared/stat/stat.module';
import { ChartsModule } from 'ng2-charts';
import { EditorModule } from '@tinymce/tinymce-angular';
import { EncountersComponent } from './shared/encounters/encounters.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CookieService } from 'ngx-cookie-service';

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
    RxPadComponent,
    QrCodeComponent,
    QrCodeScannerComponent,
    QrCodeGenerateComponent,
    MatDialogConfirmComponent,
    DialogComponent,
    SecureComponent,
    QueComponent,
    ImageComponent,
    EncountersComponent
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
    StatModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    NgxMaterialTimepickerModule,
    NgxPrintModule,
    ZXingScannerModule,
    QRCodeModule,
    UploadModule,
    ChartsModule,
    WebcamModule,
    PerfectScrollbarModule,
    EditorModule,
    ImageCropperModule
  ],
  providers: [
    AppConfiguration,
    UploadService,
    CookieService,
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
    QrCodeGenerateComponent,
    DialogComponent,
    RxPadComponent,
    QrCodeScannerComponent,
    ImageComponent,
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
