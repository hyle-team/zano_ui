import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PageMaterialIconsComponent } from '@parts/pages/page-material-icons/page-material-icons.component';

@NgModule({
    imports: [RouterModule.forRoot([
        // Dev routes for looking at icons
        {
            path: 'material-zano-icon',
            component: PageMaterialIconsComponent
        }
    ])],
    exports: [RouterModule],
})
export class AppRoutingModule {}
