import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';

import { MessagesComponent } from './messages.component';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageFormComponent } from './message-form/message-form.component';
import { MessageDetailComponent } from './message-detail/message-detail.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';

@NgModule({
  declarations: [
    MessagesComponent,
    MessageListComponent,
    MessageFormComponent,
    MessageDetailComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    SharedModule,
    FlexLayoutModule,
    RouterModule.forChild([
      { path: '', component: MessagesComponent },
    ])
  ]
})
export class MessagesModule { }
