import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TraderRoutingModule } from './trader-routing.module';
import { CoinsComponent } from './coins/coins.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TargetComponent } from './target/target.component';
import { SetTargetComponent } from './target/set-target/set-target.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CoinsComponent,
    DashboardComponent,
    TargetComponent,
    SetTargetComponent
  ],
  imports: [
    CommonModule,
    TraderRoutingModule,
    SharedModule
  ]
})
export class TraderModule { }
