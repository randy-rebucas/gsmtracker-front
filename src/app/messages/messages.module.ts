import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthGuard } from '../auth/auth-guard';

import { MessagesComponent } from './messages.component';
import { MessageInitialComponent } from './message-initial/message-initial.component';
import { MessageEditComponent } from './message-edit/message-edit.component';
import { MessageDetailComponent } from './message-detail/message-detail.component';
import { MessageListComponent } from './message-list/message-list.component';
import { EllipsisPipe } from '../ellipsis-pipe';

@NgModule({
  declarations: [
    MessagesComponent,
    MessageListComponent,
    MessageInitialComponent,
    MessageEditComponent,
    MessageDetailComponent,
    EllipsisPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    PerfectScrollbarModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
      { path: '', component: MessagesComponent, canActivate: [AuthGuard], children: [
        { path: '', component: MessageInitialComponent },
        { path: 'new', component: MessageEditComponent },
        { path: ':messageId', component: MessageDetailComponent }
      ]}
    ])
  ]
})
export class MessagesModule {}
