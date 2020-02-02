import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from './modules/authentication/authentication.guard';

const routes: Routes = [
  { path: 'page', loadChildren: () => import('./modules/page/page.module').then(m => m.PageModule) },
  { path: 'secure', loadChildren: () => import('./modules/secure/secure.module').then(m => m.SecureModule) },
  { path: 'auth', loadChildren: () => import('./modules/authentication/authentication.module').then(m => m.AuthenticationModule) },
  { path: '', redirectTo: 'page', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
