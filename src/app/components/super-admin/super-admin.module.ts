import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';
import { SuperAdminTraderComponent } from './super-admin-trader/super-admin-trader.component';
import { SuperAdminSoldCoinsComponent } from './super-admin-sold-coins/super-admin-sold-coins.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SuperAdminCoinsComponent } from './super-admin-coins/super-admin-coins.component';


@NgModule({
  declarations: [
    SuperAdminDashboardComponent,
    SuperAdminTraderComponent,
    SuperAdminSoldCoinsComponent,
    SuperAdminCoinsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SuperAdminRoutingModule
  ]
})
export class SuperAdminModule { }
