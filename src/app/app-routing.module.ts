import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren: './modules/home/home.module#HomeModule'},
  {path: 'about', loadChildren: './modules/about/about.module#AboutModule'},
  {path: 'contact', loadChildren: './modules/contact/contact.module#ContactModule'},
  {path: 'auth', loadChildren: './modules/authentication/authentication.module#AuthenticationModule'},
  {path: 'dashboard', loadChildren: './modules/dashboard/dashboard.module#DashboardModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
