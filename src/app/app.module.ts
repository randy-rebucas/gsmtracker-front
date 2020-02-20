import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { FlexLayoutModule } from '@angular/flex-layout';
// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule, TranslateCompiler} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
// import ngx-translate-messageformat-compiler
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { MESSAGE_FORMAT_CONFIG } from 'ngx-translate-messageformat-compiler';

import { CanDeactivateGuard } from './modules/secure/user/patients/can-deactivate.guard';
import { DefaultModule } from './layouts/default/default.module';
import { FrontComponent } from './layouts/front/front.component';

// import { registerLocaleData } from '@angular/common';
// import localeFr from '@angular/common/locales/fr';
// import localeFrExtra from '@angular/common/locales/extra/fr';

// registerLocaleData(localeFr, 'fr-FR', localeFrExtra)

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

