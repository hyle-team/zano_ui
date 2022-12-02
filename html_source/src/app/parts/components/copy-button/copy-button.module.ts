import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyButtonComponent } from './copy-button.component';

@NgModule({
  declarations: [CopyButtonComponent],
  exports: [CopyButtonComponent],
  imports: [CommonModule],
})
export class CopyButtonModule {}
