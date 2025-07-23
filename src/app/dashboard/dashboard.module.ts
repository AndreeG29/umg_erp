import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GoogleChartsModule
  ],
  exports: [
    GoogleChartsModule
  ]
})
export class DashboardModule { }