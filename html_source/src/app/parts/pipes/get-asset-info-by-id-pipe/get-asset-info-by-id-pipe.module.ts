import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetAssetInfoByIdPipe } from './get-asset-info-by-id.pipe';

@NgModule({
  declarations: [GetAssetInfoByIdPipe],
  imports: [CommonModule],
  providers: [CommonModule],
  exports: [GetAssetInfoByIdPipe],
})
export class GetAssetInfoByIdPipeModule {}
