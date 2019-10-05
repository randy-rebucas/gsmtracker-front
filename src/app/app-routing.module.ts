import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AuthGuard } from './auth/auth-guard';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { EncountersComponent } from './patients/patient-record/encounters/encounters.component';
import { EncounterListComponent } from './patients/patient-record/encounters/encounter-list/encounter-list.component';
import { RxPadComponent } from './rx-pad/rx-pad.component';
import { UsersComponent } from './users/users.component';
import { EncounterFormComponent } from './patients/patient-record/encounters/encounter-form/encounter-form.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    // {
    //   path: 'encounter', component: EncountersComponent, canActivate: [AuthGuard], children: [
    //     { path: '', component: EncounterListComponent },
    //     { path: ':encounterId', component: EncounterFormComponent }
    //   ]
    // },
    // { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },

    // { path: 'rxpad/:padIds', component: RxPadComponent },

    { path: 'patients', loadChildren: './patients/patients.module#PatientsModule'},
    { path: 'appointments', loadChildren: './appointments/appointment.module#AppointmentModule'},
    { path: 'messages', loadChildren: './messages/messages.module#MessagesModule'},
    { path: 'settings', loadChildren: './settings/settings.module#SettingsModule'},
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

