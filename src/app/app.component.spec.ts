import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import {
  MatSidenavModule,
  MatIconModule,
  MatMenuModule,
  MatListModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatDialogModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { AppConfiguration } from './app-configuration.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatMenuModule,
        MatListModule,
        MatSidenavModule,
        MatIconModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatDialogModule,
        TranslateModule.forRoot(),
        HttpClientModule
      ],
      declarations: [
        AppComponent,
        MainNavComponent
      ],
      providers: [AppConfiguration],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'clinic-plus'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('clinic-plus');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to clinic-plus!');
  });
});
