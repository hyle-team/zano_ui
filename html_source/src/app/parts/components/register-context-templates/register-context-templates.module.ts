import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterContextTemplatesComponent } from './register-context-templates.component';
import {
  ContextMenuModule,
  ContextMenuService,
} from '@perfectmemory/ngx-contextmenu';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [RegisterContextTemplatesComponent],
  imports: [CommonModule, ContextMenuModule, TranslateModule],
  providers: [ContextMenuService],
  exports: [RegisterContextTemplatesComponent],
})
export class RegisterContextTemplatesModule {}
