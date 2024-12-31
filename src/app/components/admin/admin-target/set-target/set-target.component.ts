import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AdminTargetComponent } from '../admin-target.component';
import { FormArray,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TraderService } from 'src/app/components/trader/trader.service';
import { debounceTime, Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-set-target',
  templateUrl: './set-target.component.html',
  styleUrls: ['./set-target.component.scss']
})
export class SetTargetComponent implements OnInit{

   form!: FormGroup;
   searchKey='';
   allCoinList: Array<any> = [];
   filteredCoinArray: Array<any> = [];
   percentageError: boolean = false;
   private searchKeyChanged: Subject<string> = new Subject<string>();
   constructor(private _traderService:TraderService,private dialogRef: MatDialogRef<AdminTargetComponent>,private fb: FormBuilder,
     private _toastrService:ToastrService,private router: Router,
   ){}
 
   ngOnInit(): void {
     this.createForm();
     this.getAllCoinList();
     this.searchKeyChanged.pipe(debounceTime(100)).subscribe((key) => {
       this.getAllCoinList(key);
     });
   }
   createForm() {
     this.form = this.fb.group({
       coin: [null, Validators.required],
       base_price: [null,Validators.required],
       currant_price: [null,Validators.required],
       return_x: [null, Validators.required],
       available_coins: [null, Validators.required],
       final_sale_price:[null,Validators.required],
       ticker_symbol:[null,Validators.required],
       setTargetFooter: this.fb.array(this.createTargetInputs(5)),
     });
   }
   get control() {
     return this.form.controls;
   }
    // Create Form Array
   get setTargetFooterArray(): FormArray {
     return this.form.get('setTargetFooter') as FormArray;
   }
   // Helper to generate form groups
   createTargetInputs(count: number): FormGroup[] {
     return Array.from({ length: count }, (_, index) =>
       this.fb.group({
         sale_target_coin: ['', [Validators.min(0), Validators.max(100)]],
         sale_target_percent: [`${index + 1}`], // Dynamic ID
       })
     );
   }
    // Validate that the total percentage is exactly 100%
    validateExactPercentage() {
     const totalPercentage = this.setTargetFooterArray.controls
       .map((control) => control.value.sale_target_coin || 0)
       .reduce((sum, current) => sum + current, 0);
       this.percentageError = totalPercentage !== 100;
   }
   //get coin list...
   getAllCoinList(searchKey: string = '') {
     this._traderService.getAllCoinListWma(searchKey).subscribe({
       next: (res: any) => {
         if (res.data && res.data.length > 0) {
           this.allCoinList = res.data;
           this.filteredCoinArray = res.data;
         } else {
           this.allCoinList = [];
           this.filteredCoinArray = [];
         }
       },
       error: (err) => {
         this.allCoinList = [];
         this.filteredCoinArray = [];
       },
     });
   }
 
   onCoinChange(event: any) {
     const selectedCoinName = event.value; // Fetch the coin name  
     const selectedCoin = this.allCoinList.find(item => item.coin_name === selectedCoinName);
     if (selectedCoin) {
       this.control['coin'].patchValue(selectedCoin.coin_name); // Update form with the coin_name 
       this._traderService.getCoinById(selectedCoin.coin_id).subscribe({
         next: (res: any) => {
           const tickerSymbol = res.data.ticker_symbol;
           this.control['ticker_symbol'].patchValue(tickerSymbol);
           if (tickerSymbol) {
             this._traderService.getCurrentPriceByTicker(tickerSymbol).subscribe({
               next: (res: any) => {
                 this.control['currant_price'].patchValue(res.data.currentPrice);
               },
             });
           }
         },
       });
     }
   }
 
    //Filter coin array
    filterCoinList() {
     this.searchKeyChanged.next(this.searchKey.trim());
   }
   calculateFinalSalePrice(): void {
     const basePrice = this.form.get('base_price')?.value || 0;
     const returnX = this.form.get('return_x')?.value || 0;
     const finalSalePrice = basePrice * returnX;
     this.form.get('final_sale_price')?.setValue(finalSalePrice);
   }
    //  submit() {  
    //    Swal.fire({
    //      title: 'Are you sure?',
    //      text: 'Do you want to Set Target?',
    //      icon: 'question',
    //      showCancelButton: true,
    //      confirmButtonColor: '#3085d6',
    //      cancelButtonColor: '#d33',
    //      confirmButtonText: 'Yes!'
    //    }).then((result:any) => {
    //      if (result.isConfirmed) {
    //        this.addSetTarget();
    //      }
    //    })
    //  }
     addSetTarget(){
     if (this.form.valid) {
       this._traderService.addSetTarget(this.form.getRawValue()).subscribe({
         next: (res: any) => {
           if (res.status == 201 || res.status == 200) {
             this._toastrService.success(res.message);
             this.closeDialog('message');
           } else {
             this._toastrService.warning(res.message);
           }
         },
         error: (err: any) => {
           if (err.error.status == 422) {
             this._toastrService.warning(err.error.message);
           } else {
             this._toastrService.error('Internal Server Error');
           }
         },
       });
     } else {
       this.form.markAllAsTouched();
       this._toastrService.warning('Fill required fields');
     }
   }
   closeDialog(message?: any) {
     this.dialogRef.close(message);
   }
 }
 
