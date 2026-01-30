import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisablePriceFetchDirective } from '@parts/directives';

@NgModule({
    declarations: [DisablePriceFetchDirective],
    imports: [CommonModule],
    exports: [DisablePriceFetchDirective],
})
export class DisablePriceFetchModule {}
