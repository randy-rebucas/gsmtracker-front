import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'page', loadChildren: () => import('./modules/page/page.module').then(m => m.PageModule) },
  { path: 'secure', loadChildren: () => import('./modules/secure/secure.module').then(m => m.SecureModule) },
  { path: 'auth', loadChildren: () => import('./modules/authentication/authentication.module').then(m => m.AuthenticationModule) },
  { path: '', redirectTo: 'page', pathMatch: 'full' },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  declarations:[
    PageNotFoundComponent
  ],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
