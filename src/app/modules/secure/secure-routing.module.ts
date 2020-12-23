import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from 'src/app/layouts/default/default.component';

const routes: Routes = [{
  path: '',
  component: DefaultComponent,
  children: [
    { path: '', redirectTo: 'repairs', pathMatch: 'full' },
    { path: 'repairs', loadChildren: () => import('./repairs/repairs.module').then(m => m.RepairsModule) },
    { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecureRoutingModule { }
