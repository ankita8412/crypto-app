import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminCoinsComponent } from './admin-coins/admin-coins.component';
import { AdminTargetComponent } from './admin-target/admin-target.component';
import { SetTargetComponent } from './admin-target/add-update-set-target/set-target.component';
import { MastersComponent } from './masters/masters.component';
import { ComplitionComponent } from './masters/complition/complition.component';
import { TargetComponent } from './masters/target/target.component';
import { UsersComponent } from './users/users.component';
import { AddUserComponent } from './users/add-update-user/add-user.component';
import { AdminSoldCoinsComponent } from './admin-sold-coins/admin-sold-coins.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminCoinsComponent,
    AdminTargetComponent,
    SetTargetComponent,
    MastersComponent,
    ComplitionComponent,
    TargetComponent,
    UsersComponent,
    AddUserComponent,
    AdminSoldCoinsComponent,
  
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
