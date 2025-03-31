import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { TraderService } from 'src/app/components/trader/trader.service';
import { debounceTime, Subject } from 'rxjs';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-set-target',
  templateUrl: './set-target.component.html',
  styleUrls: ['./set-target.component.scss'],
})
export class SetTargetComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  searchKey = '';
  sale_target_id: any;
  allCoinList: Array<any> = [];
  filteredCoinArray: Array<any> = [];
  percentageError: boolean = false;
  fetchCurrentPriceError = false;
  isCurrentPriceReadonly = true;
  fetchFDVError = false;
  isFDVReadonly = true;
  fetchMarketCapError = false;
  isMarketCapReadonly = true;
  isLoading = true;
  isUpdating = false;
  private searchKeyChanged: Subject<string> = new Subject<string>();
  constructor(
    private _traderService: TraderService,
    private fb: FormBuilder,
    private _toastrService: ToastrService,
    private url: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.sale_target_id = this.url.snapshot.params['id'];
    if (this.sale_target_id) {
      this.getSetTargetById(this.sale_target_id);
      this.isEdit = true;
      this.isCurrentPriceReadonly = false;
      this.isMarketCapReadonly = false;
      this.isFDVReadonly = false
    }
    this.getAllCoinList();
    this.searchKeyChanged.pipe(debounceTime(100)).subscribe((key) => {
      this.getAllCoinList(key);
    });
    this.form.controls['exchange'].valueChanges
    .pipe(debounceTime(600)) // 500ms delay rakhega
    .subscribe(value => {
      if (this.isUpdating) return;
      if (value) {
        this.checkExchangeConi(); // Jab user typing stop karega tab call hoga
      }
    });
  }
  createForm() {
    this.form = this.fb.group({
      ticker: [null, Validators.required],
      coin: [null],
      exchange : [null],
      base_price: [null],
      currant_price: [null],
      market_cap: [''],
      return_x: [null],
      available_coins: [null],
      final_sale_price: [null],
      current_value: [null],
      current_return_x: [null],
      timeframe: [null],
      narrative: [null],
      fdv_ratio: [''],
      setTargetFooter: this.fb.array(this.createTargetInputs(5)),
    });
    this.handlePriceChange();
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
        sale_target_value: [
          '',
       
        ],
        sale_target_percent: [`${index + 1}`], // Dynamic ID
      })
    );
  }
  // Custom validator for total percentage
  // totalPercentageValidator() {
  //   return (formArray: AbstractControl): ValidationErrors | null => {
  //     const total = (formArray as FormArray).controls.reduce((sum, control) => {
  //       const value = parseInt(control.get('sale_target_value')?.value, 10) || 0;
  //       return sum + value;
  //     }, 0);
  //     return total > 100 ? { totalExceeds100: true } : null;
  //   };
  // }
  // Validate and prevent submission
  validateExactPercentage(): void {
    // this.form.updateValueAndValidity();
  
    // const total = this.setTargetFooterArray.controls.reduce((sum, control) => {
    //   return sum + (parseInt(control.get('sale_target_value')?.value, 10) || 0);
    // }, 0);
  
    // if (total <= 0 || total > 100) {
    //   this._toastrService.clear();
    //   this._toastrService.warning('Total percentage must be greater than 0 and exactly 100.');
    //   this.percentageError = true;
    // } else {
    //   this.percentageError = false;
    // }
  }
  


  submit() {
    this.isEdit ? this.updateSetTarget() : this.addSetTarget();
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
    const selectedCoinName = event.value;

    // Reset current price and error states
    this.form.controls['currant_price'].reset();
    this.form.controls['market_cap'].reset();
    this.form.controls['fdv_ratio'].reset();
    this.fetchFDVError = false;
    this.isFDVReadonly = true;
    this.fetchCurrentPriceError = false;
    this.isCurrentPriceReadonly = true;
    this.fetchMarketCapError = false;
    this.isMarketCapReadonly = true;
    const selectedCoin = this.allCoinList.find(
      (item) => item.short_name === selectedCoinName
    );

    if (selectedCoin) {
      this.form.controls['coin'].patchValue(selectedCoin.coin_name.split(' (')[0]);

      this._traderService.getCoinById(selectedCoin.coin_id).subscribe({
        next: () => {
          this.form.controls['ticker'].patchValue(selectedCoin.short_name);

          if (selectedCoin.short_name) {
            this.isLoading = false;
            this._traderService.getCurrentPriceByTicker(selectedCoin.short_name).subscribe({
              next: (res: any) => {
                const currentPrice = res?.data?.currentPrice;
                const FDV = res?.data?.FDV
                const MarketCap = res?.data?.mktcap;

                // Check if currentPrice, FDV, and MarketCap are valid numbers
                // Handle currentPrice logic
                if (currentPrice && !isNaN(currentPrice)) {
                  this.isLoading = true;
                  this.fetchCurrentPriceError = false;
                  this.isCurrentPriceReadonly = true;
                  this.form.controls['currant_price'].patchValue(currentPrice);
                } else {
                  this.isLoading = true;
                  this.fetchCurrentPriceError = true;
                  this.isCurrentPriceReadonly = false;
                  this.form.controls['currant_price'].setErrors({ required: true });
                }

                // Handle MarketCap logic
                if (FDV && !isNaN(FDV)) {
                  this.isLoading = true;
                  this.fetchFDVError = false;
                  this.isFDVReadonly = true;
                  this.form.controls['fdv_ratio'].patchValue(Number(FDV).toFixed(4));
                } else {
                  this.isLoading = true;
                  this.fetchFDVError = true;
                  this.isFDVReadonly = false;
                  this.form.controls['fdv_ratio'].setErrors({ required: true });
                }
                // Handle MarketCap logic
                if (MarketCap && !isNaN(MarketCap)) {
                  this.isLoading = true;
                  this.fetchMarketCapError = false;
                  this.isMarketCapReadonly = true;
                  this.form.controls['market_cap'].patchValue(Number(MarketCap).toFixed(2));
                } else {
                  this.isLoading = true;
                  this.fetchMarketCapError = true;
                  this.isMarketCapReadonly = false;
                  this.form.controls['market_cap'].setErrors({ required: true });
                }

              },
              error: (err) => {
           
                // Handle API failure
                this.fetchCurrentPriceError = true; // Mark fetch as failed
                this.isCurrentPriceReadonly = false; // Allow typing
                this.form.controls['currant_price'].setErrors({ required: true });

                this.fetchMarketCapError = true;
                this.isMarketCapReadonly = false;
                this.form.controls['market_cap'].setErrors({ required: true });

                this.fetchFDVError = true;
                this.isFDVReadonly = false;
                this.form.controls['fdv_ratio'].setErrors({ required: true });
              },
            });
          }

        },
      });
    }
  }

  // onInputChange() {
  //   // Allow typing without toggling readonly state
  //   if (this.fetchCurrentPriceError) {
  //     this.fetchCurrentPriceError = false;
  //   }
  //   if (!this.form.controls['currant_price'].value) {
  //     this.fetchCurrentPriceError = true;
  //   }
  // }
  // onFDVInputChange() {
  //   // Allow typing without toggling readonly state
  //   if (this.fetchFDVError) {
  //     this.fetchFDVError = false;
  //   }
  //   if (!this.form.controls['fdv_ratio'].value) {
  //     this.fetchFDVError = true;
  //   }
  // }
  // onMarketCapInputChange() {
  //   // Allow typing without toggling readonly state for MarketCap
  //   if (this.fetchMarketCapError) {
  //     this.fetchMarketCapError = false;
  //   }
  //   if (!this.form.controls['market_cap'].value) {
  //     this.fetchMarketCapError = true;
  //   }
  // }
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

  handlePriceChange() {
    this.form.get('currant_price')?.valueChanges.subscribe(() => {
      this.updateCalculatedFields();
    });

    this.form.get('base_price')?.valueChanges.subscribe(() => {
      this.updateCalculatedFields();
    });
    this.form.get('available_coins')?.valueChanges.subscribe(() => {
      this.updateCalculatedFields();
    });
  }

  updateCalculatedFields() {
    const basePrice = this.form.get('base_price')?.value;
    const currantPrice = this.form.get('currant_price')?.value;
    const availableCoins = this.form.get('available_coins')?.value;

      // Calculate current_return_x
      if (basePrice !== null && basePrice !== undefined && currantPrice !== null && currantPrice !== undefined) {
        let currentReturnX = 0; // Default to 0 if basePrice is 0 to avoid Infinity
      
        if (basePrice !== 0) {
          currentReturnX = currantPrice / basePrice;
        }
      
        this.form.get('current_return_x')?.patchValue(currentReturnX.toFixed(2), { emitEvent: false });
      }
      
       // Calculate current_value
       if (currantPrice !== null && currantPrice !== undefined && !isNaN(availableCoins)) {
        const currentValue = availableCoins > 0 ? currantPrice * availableCoins : 0;
        this.form.get('current_value')?.patchValue(currentValue, { emitEvent: false });
      } else {
        this.form.get('current_value')?.patchValue(null, { emitEvent: false }); 
      }
  }

  addSetTarget() {
          Swal.fire({
                text: 'Do you want to Save ?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                customClass: {
                  popup: 'small-swal' // Add a custom class
                }
              }).then((result) => {
            if (result.isConfirmed) {
              this._traderService.addSetTarget(this.form.getRawValue()).subscribe({
                next: (res: any) => {
                  if (res.status == 201 || res.status == 200) {
                    this._toastrService.success(res.message);
                    // this.router.navigate(['/trader', { outlets: { trader_Menu: 'target' } }]);
                    this.goToback();
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
                }
              });
            }
          });
        
  }
  updateSetTarget() {
    let data = this.form.getRawValue();
        Swal.fire({
          text: 'Do you want to Update ?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
          customClass: {
            popup: 'small-swal' // Add a custom class
          }
        }).then((result) => {
      if (result.isConfirmed) {
       this._traderService.editSetTarget(this.sale_target_id, data).subscribe({
          next: (res: any) => {
            if (res.status == 200) {
              this._toastrService.success(res.message);
              // this.router.navigate([
              //   '/trader',
              //   { outlets: { trader_Menu: 'target' } },
              // ]);
              this.goToback();
            } else {
              this._toastrService.warning(res.message);
            }
          },
          error: (err: any) => {
            if (err.error.status == 401 || err.error.status == 422) {
              this._toastrService.warning(err.error.message);
            } else {
              this._toastrService.error('Internal Server Error');
            }
          },
        });
      }
    });
      
      
  }

  getSetTargetById(id: any) {
    this.isUpdating = true; 
    this._traderService.getSetTargetById(id).subscribe({
      next: (res: any) => {
        const targetData = res.data;
        // console.log('data',targetData.ticker);
        this.searchKeyChanged.next(targetData.ticker);
        this.control['ticker'].patchValue(targetData.ticker)
        this.control['coin'].patchValue(targetData.coin);
        this.control['exchange'].patchValue(targetData.exchange);
        this.control['base_price'].patchValue(targetData.base_price);
        this.control['base_price'].patchValue(targetData.base_price);
        this.control['currant_price'].patchValue(targetData.currant_price);
        this.control['market_cap'].patchValue(targetData.market_cap);
        this.control['available_coins'].patchValue(targetData.available_coins);
        this.control['final_sale_price'].patchValue(
          targetData.final_sale_price
        );
        this.control['return_x'].patchValue(targetData.return_x);
        this.control['timeframe'].patchValue(targetData.timeframe);
        this.control['narrative'].patchValue(targetData.narrative);
        this.control['fdv_ratio'].patchValue(targetData.fdv_ratio);
        this.patchFooterData(targetData.footer);
        setTimeout(() => {
          this.isUpdating = false; 
        }, 600);
      },
    });
  }

  patchFooterData(footerData: any[]) {
    const footerArray = this.form.get('setTargetFooter') as FormArray;
    footerArray.clear(); // Clear existing controls
    footerData.forEach((item) => {
      footerArray.push(
        this.fb.group({
          sale_target_value: [item.sale_target_value],
          sale_target_percent: [item.sale_target_percent],
          sale_target: [item.sale_target],
          target_status: [item.target_status],
          complition_status: [item.complition_status],
          set_footer_id: [item.set_footer_id],

        })
      );
    });
  }
  extractTickerSymbol(coin: string): string {
    const match = /\(([^)]+)\)/.exec(coin);
    return match ? match[1] : coin;
  }
  // cancel route location service
  goToback() {
    this.location.back();
  }
  checkExchangeConi() {
    const data = {
      coin: this.form.value.coin,
      exchange: this.form.value.exchange,
      sale_target_id: this.isEdit ? this.sale_target_id : null
    };
  
    // Check if ticker and exchange have values before proceeding
    if (data.coin && data.exchange) {
      this._traderService.CheckExchangeCoin(data).subscribe({
        next: (res: any) => {
          if (res.status === 200 || res.status === 201) {
            this._toastrService.clear();
            this.form.controls['exchange'].setErrors(null); // Clear error if valid
          } else {
            this._toastrService.clear();
            this._toastrService.warning(res.message);
            this.form.controls['exchange'].setErrors({ invalidExchange: true }); // Set error
          }
        },
        error: (err: any) => {
          this._toastrService.warning(err.error.message);
          this.form.controls['exchange'].setErrors({ invalidExchange: true }); // Set error
        }
      });
    } else {
      this.form.markAllAsTouched();
      this._toastrService.warning('Fill required fields');
    }
  }
  onInputChangePurchasedCion(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    if (!value.trim()) {
        this.form.controls["available_coins"].setValue(null);
        return;
    }
    const regex = /^\d{0,10}(\.\d{0,4})?$/;
    if (!regex.test(value)) {
        return; // Stop further processing if invalid
    }
    this.form.controls["available_coins"].setValue(value, { emitEvent: false });
}

onBlurPurchasedCoins() {
    let value = this.form.controls["available_coins"].value;

    if (value && value.includes(".")) {
        let [integerPart, decimalPart] = value.split(".");

        if (/^0+$/.test(decimalPart)) {
            value = integerPart;
        } else {
      
            value = `${integerPart}.${decimalPart}`;
        }
    }

    if (!value || value === "0" || value.match(/^0+(\.0+)?$/)) {
        value = null;
    }

    this.form.controls["available_coins"].setValue(value, { emitEvent: false });
}
  
  
  
}
