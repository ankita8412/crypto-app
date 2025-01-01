import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { TraderService } from 'src/app/components/trader/trader.service';
import { debounceTime, Subject } from 'rxjs';

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
  private searchKeyChanged: Subject<string> = new Subject<string>();
  constructor(
    private _traderService: TraderService,
    private fb: FormBuilder,
    private _toastrService: ToastrService,
    private url: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.sale_target_id = this.url.snapshot.params['id'];
    if (this.sale_target_id) {
      this.getSetTargetById(this.sale_target_id);
      this.isEdit = true;
    }
    this.getAllCoinList();
    this.searchKeyChanged.pipe(debounceTime(100)).subscribe((key) => {
      this.getAllCoinList(key);
    });
  }
  createForm() {
    this.form = this.fb.group({
      coin: [null, Validators.required],
      base_price: [null, Validators.required],
      currant_price: [null, Validators.required],
      return_x: [null, Validators.required],
      available_coins: [null, Validators.required],
      final_sale_price: [null, Validators.required],
      ticker_symbol: [null,Validators.required],
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

  submit() {
    this.isEdit ? this.updateSetTarget() : this.addSetTarget();
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
    const selectedCoin = this.allCoinList.find(
      (item) => item.coin_name === selectedCoinName
    );
    if (selectedCoin) {
      this.control['coin'].patchValue(selectedCoin.coin_name); // Update form with the coin_name
      this._traderService.getCoinById(selectedCoin.coin_id).subscribe({
        next: (res: any) => {
          const tickerSymbol = res.data.ticker_symbol;
          this.control['ticker_symbol'].patchValue(tickerSymbol);
          if (tickerSymbol) {
            this._traderService
              .getCurrentPriceByTicker(tickerSymbol)
              .subscribe({
                next: (res: any) => {
                  this.control['currant_price'].patchValue(
                    res.data.currentPrice
                  );
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

  addSetTarget() {
    if (this.form.valid) {
      this._traderService.addSetTarget(this.form.getRawValue()).subscribe({
        next: (res: any) => {
          if (res.status == 201 || res.status == 200) {
            this._toastrService.success(res.message);
            this.router.navigate([
              '/admin',
              { outlets: { admin_Menu: 'admin-target' } },
            ]);
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

  updateSetTarget() {
    let data = this.form.getRawValue();
    console.log("form value",this.form.value);
    
    if (this.form.valid) {
      this._traderService.editSetTarget(this.sale_target_id, data).subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            this._toastrService.success(res.message);
            this.router.navigate([
              '/admin',
              { outlets: { admin_Menu: 'admin-target' } },
            ]);
          } else {
            this._toastrService.warning(res.message);
          }
        },
        error: (err: any) => {
          if (err.error.status == 401 || err.error.status == 422) {
            this._toastrService.warning(err.error.message);
          } else {
            this._toastrService.error(err.error.message);
          }
        },
      });
    } else {
      this.form.markAllAsTouched();
      this._toastrService.warning('Fill required fields');
    }
  }

  getSetTargetById(id: any) {
    this._traderService.getSetTargetById(id).subscribe({
      next: (res: any) => {
        const targetData = res.data;
        console.log('getSetTargetById', res.data);
        this.control['coin'].patchValue(targetData.coin);
        this.control['base_price'].patchValue(targetData.base_price);
        this.control['currant_price'].patchValue(targetData.currant_price);
        this.control['available_coins'].patchValue(targetData.available_coins);
        this.control['final_sale_price'].patchValue(targetData.final_sale_price);
        const tickerSymbol = this.extractTickerSymbol(targetData.coin);
        this.control['ticker_symbol'].patchValue(tickerSymbol);
        this.control['return_x'].patchValue(targetData.return_x);
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
          sale_target_coin: [item.sale_target_coin * 10 ,[Validators.min(0), Validators.max(100)]],
          sale_target_percent: [item.sale_target_percent],
          sale_target: [item.sale_target],
          target_status: [item.target_status],
          complition_status: [item.complition_status],
          set_footer_id : [item.set_footer_id]
        })
      );
    });
  }
  extractTickerSymbol(coin: string): string {
    const match = /\(([^)]+)\)/.exec(coin);
    return match ? match[1] : coin; 
  }
}
