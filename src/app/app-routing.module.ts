import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AuthGuard } from './auth/auth-guard';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { RxPadComponent } from './rx-pad/rx-pad.component';
import { UsersComponent } from './users/users.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    // { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
    // { path: 'rxpad/:padIds', component: RxPadComponent },

    { path: 'patients', loadChildren: './patients/patients.module#PatientsModule'},
    { path: 'appointments', loadChildren: './appointments/appointment.module#AppointmentModule'},
    { path: 'messages', loadChildren: './messages/messages.module#MessagesModule'},
    { path: 'settings', loadChildren: './settings/settings.module#SettingsModule'},
    { path: 'que', loadChildren: './que/que.module#QueModule'},
    { path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
    { path: 'not-found', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/not-found' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: false, preloadingStrategy: PreloadAllModules }
        )
    ],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {

}

