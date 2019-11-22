import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from './modules/authentication/authentication.guard';

const routes: Routes = [
  {path: '', loadChildren: './modules/home/home.module#HomeModule'},
  {path: 'about', loadChildren: './modules/about/about.module#AboutModule'},
  {path: 'contact', loadChildren: './modules/contact/contact.module#ContactModule'},
  {path: 'auth', loadChildren: './modules/authentication/authentication.module#AuthenticationModule'},
  {path: 'dashboard', loadChildren: './modules/dashboard/dashboard.module#DashboardModule'},
  {path: 'patients', loadChildren: './modules/patients/patients.module#PatientsModule'},
  {path: 'appointments', loadChildren: './modules/appointments/appointments.module#AppointmentsModule'},
  {path: 'messages', loadChildren: './modules/messages/messages.module#MessagesModule'},
  {path: 'settings', loadChildren: './modules/settings/settings.module#SettingsModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
