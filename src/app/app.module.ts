import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ErrorComponent } from './modules/error/error.component';
import { PromptDialogComponent } from './modules/prompt-dialog/prompt-dialog.component';
import { AuthenticationInterceptor } from './modules/authentication/authentication-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { CookieService } from 'ngx-cookie-service';
import { AppConfigurationService } from './configs/app-configuration.service';
import { AngularMaterialModule } from './angular-material.module';
// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule, TranslateCompiler } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import ngx-translate-messageformat-compiler
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { MESSAGE_FORMAT_CONFIG } from 'ngx-translate-messageformat-compiler';

import { CanDeactivateGuard } from './modules/secure/user/patients/can-deactivate.guard';
import { DefaultModule } from './layouts/default/default.module';
import { FrontComponent } from './layouts/front/front.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';


// import { registerLocaleData } from '@angular/common';
// import localeFr from '@angular/common/locales/fr';
// import localeFrExtra from '@angular/common/locales/extra/fr';

// registerLocaleData(localeFr, 'fr-FR', localeFrExtra)
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    PromptDialogComponent,
    FrontComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    DefaultModule,

    PerfectScrollbarModule,
    AngularMaterialModule,
    // ngx-translate and the loader module
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
  ],
  providers: [
    CookieService,
    CanDeactivateGuard,
    // app-configuration
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    AppConfigurationService,
    {
      provide: APP_INITIALIZER,
      useFactory: AppConfigurationFactory,
      deps: [AppConfigurationService, HttpClient], multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ErrorComponent,
    PromptDialogComponent
  ]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function AppConfigurationFactory( appConfiguration: AppConfigurationService ) {
  return () => appConfiguration.ensureInit();
}

