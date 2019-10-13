import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordComponent } from './record.component';
import { MatCardModule } from '@angular/material';
import { MatGridListModule, MatIconModule } from '@angular/material';
import { ReplacePipe } from 'src/app/replace-pipe';

@NgModule({
    imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule],
    declarations: [RecordComponent, ReplacePipe],
    exports: [RecordComponent]
})
export class RecordModule {}
