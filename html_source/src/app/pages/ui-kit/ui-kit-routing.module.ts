import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UiKitComponent } from './ui-kit.component';
import { paths } from '../../paths';
import { WithSidebarLayoutComponent } from '../../layouts/with-sidebar-layout/with-sidebar-layout.component';

const routes: Routes = [
  {
    path: paths.uiKit,
    component: WithSidebarLayoutComponent,
    children: [{ path: '', component: UiKitComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UiKitRoutingModule {}
