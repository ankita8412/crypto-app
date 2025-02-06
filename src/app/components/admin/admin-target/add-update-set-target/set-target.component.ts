import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { TraderService } from 'src/app/components/trader/trader.service';
import { debounceTime, Subject } from 'rxjs';
import { Location } from '@angular/common';
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
  }
  createForm() {
    this.form = this.fb.group({
      ticker: [null, Validators.required],
      coin: [null, Validators.required],
      base_price: [null, Validators.required],
      currant_price: [null, Validators.required],
      market_cap: ['', Validators.required],
      return_x: [null, Validators.required],
      available_coins: [null, Validators.required],
      final_sale_price: [null, Validators.required],
      current_value: [null, Validators.required],
      current_return_x: [null, Validators.required],
      timeframe: [null, Validators.required],
      fdv_ratio: [null, Validators.required],
      setTargetFooter: this.fb.array(this.createTargetInputs(5), this.totalPercentageValidator()),
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
          [
            Validators.pattern('^[0-9]{1,2}$'), // Allow only 1 or 2 digits
            Validators.min(0),
            Validators.max(100),
          ],
        ],
        sale_target_percent: [`${index + 1}`], // Dynamic ID
      })
    );
  }
  // Custom validator for total percentage
  totalPercentageValidator() {
    return (formArray: AbstractControl): ValidationErrors | null => {
      const total = (formArray as FormArray).controls.reduce((sum, control) => {
        const value = parseInt(control.get('sale_target_value')?.value, 10) || 0;
        return sum + value;
      }, 0);
      return total === 100 ? null : { totalNot100: true };
    };
  }
  // Validate and prevent submission
  validateExactPercentage(): void {
    this.form.updateValueAndValidity();
    this.percentageError = this.form.hasError('totalNot100', 'setTargetFooter');
    // if (this.percentageError) {
    //   this._toastrService.warning('The total percentage of all inputs must be exactly 100%.');
    //   // this._toastrService.clear();
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
                // Log the error for debugging purposes
                console.error('API Error:', err);

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
        error: (err) => {
          console.error('Get Coin By ID Error:', err); // Log error if needed
        },
      });
    }
  }

  onInputChange() {
    // Allow typing without toggling readonly state
    if (this.fetchCurrentPriceError) {
      this.fetchCurrentPriceError = false;
    }
    if (!this.form.controls['currant_price'].value) {
      this.fetchCurrentPriceError = true;
    }
  }
  onFDVInputChange() {
    // Allow typing without toggling readonly state
    if (this.fetchFDVError) {
      this.fetchFDVError = false;
    }
    if (!this.form.controls['fdv_ratio'].value) {
      this.fetchFDVError = true;
    }
  }
  onMarketCapInputChange() {
    // Allow typing without toggling readonly state for MarketCap
    if (this.fetchMarketCapError) {
      this.fetchMarketCapError = false;
    }
    if (!this.form.controls['market_cap'].value) {
      this.fetchMarketCapError = true;
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
    if (basePrice && currantPrice) {
      const currentReturnX = currantPrice / basePrice;
      this.form.get('current_return_x')?.patchValue(currentReturnX.toFixed(2), { emitEvent: false });
    }

    // Calculate current_value
    if (currantPrice && availableCoins) {
      const currentValue = currantPrice * availableCoins;
      this.form.get('current_value')?.patchValue(currentValue.toFixed(2), { emitEvent: false });
    }
  }

  addSetTarget() {
    if (this.form.valid) {
      this._traderService.addSetTarget(this.form.getRawValue()).subscribe({


        next: (res: any) => {
          if (res.status == 201 || res.status == 200) {
            this._toastrService.success(res.message);
            // this.router.navigate([
            //   '/admin',
            //   { outlets: { admin_Menu: 'admin-target' } },
            // ]);
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
        },
      });
    } else {
      this.form.markAllAsTouched();
      this._toastrService.warning('Fill required fields');
    }
    this.validateExactPercentage();
    if (this.percentageError) {
      return;
    }
  }
  updateSetTarget() {
    let data = this.form.getRawValue();
    if (this.form.valid) {
      this._traderService.editSetTarget(this.sale_target_id, data).subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            this._toastrService.success(res.message);
            // this.router.navigate([
            //   '/admin',
            //   { outlets: { admin_Menu: 'admin-target' } },
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
    } else {
      this.form.markAllAsTouched();
      this._toastrService.warning('Fill required fields');
    }
    // this.validateExactPercentage();
    // if (this.percentageError) {
    //   return; 
    // }
  }

  getSetTargetById(id: any) {
    this._traderService.getSetTargetById(id).subscribe({
      next: (res: any) => {
        const targetData = res.data;
        // console.log('data',targetData.ticker);
        this.searchKeyChanged.next(targetData.ticker);
        this.control['ticker'].patchValue(targetData.ticker)
        this.control['coin'].patchValue(targetData.coin);
        this.control['base_price'].patchValue(targetData.base_price);
        this.control['base_price'].patchValue(targetData.base_price);
        this.control['currant_price'].patchValue(targetData.currant_price);
        this.control['market_cap'].patchValue(targetData.market_cap);
        this.control['available_coins'].patchValue(targetData.available_coins);
        this.control['final_sale_price'].patchValue(
          targetData.final_sale_price
        );
        this.control['return_x'].patchValue(targetData.return_x);
        this.control['timeframe'].patchValue(targetData.timeframe)
        this.control['fdv_ratio'].patchValue(targetData.fdv_ratio);
        this.patchFooterData(targetData.footer);
      },
    });
  }

  patchFooterData(footerData: any[]) {
    const footerArray = this.form.get('setTargetFooter') as FormArray;
    footerArray.clear(); // Clear existing controls
    footerData.forEach((item) => {
      footerArray.push(
        this.fb.group({
          sale_target_value: [item.sale_target_value, [Validators.min(0), Validators.max(100)]],
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
}
