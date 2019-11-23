import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MessagesComponent } from './messages.component';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageFormComponent } from './message-form/message-form.component';
import { MessageDetailComponent } from './message-detail/message-detail.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
  MatIconModule,
  MatCardModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatListModule,
  MatMenuModule
} from '@angular/material';
import { AdsComponent } from 'src/app/shared/components/ads/ads.component';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis.pipe';

@NgModule({
  declarations: [
    MessagesComponent,
    MessageListComponent,
    MessageFormComponent,
    MessageDetailComponent,
    AdsComponent,
    EllipsisPipe
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatMenuModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
      { path: '', component: MessagesComponent },
    ])
  ]
})
export class MessagesModule { }
