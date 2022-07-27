import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryPage } from './inventory.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryPage
  },
      {
        path: 'write-off',
        loadChildren: () => import('./write-off/write-off.module').then( m => m.WriteOffPageModule)
      },
      {
        path: 'write-off-reason',
        loadChildren: () => import('./write-off-reason/write-off-reason.module').then( m => m.WriteOffReasonPageModule)
      }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryPageRoutingModule {}
