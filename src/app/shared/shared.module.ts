import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule,
    MatPaginatorModule,
    NgOtpInputModule,
    MatSlideToggleModule,
    
  ],
  exports:[
    CommonModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,MatSelectModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule,
    MatPaginatorModule,
    NgOtpInputModule,
    MatSlideToggleModule,
    
  ]
})
export class SharedModule { }
