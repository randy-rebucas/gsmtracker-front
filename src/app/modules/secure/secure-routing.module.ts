import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from 'src/app/layouts/default/default.component';

const routes: Routes = [{
  path: '',
  component: DefaultComponent,
  children: [
    { path: '', redirectTo: 'users', pathMatch: 'full' },
    { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
    { path: 'appointments', loadChildren: () => import('./appointments/appointments.module').then(m => m.AppointmentsModule) },
    { path: 'messages', loadChildren: () => import('./messages/messages.module').then(m => m.MessagesModule) },
    { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
    { path: 'users', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
    { path: 'setup', loadChildren: () => import('./setup/setup.module').then(m => m.SetupModule) }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecureRoutingModule { }
