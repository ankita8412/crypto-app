import { Component, OnInit } from '@angular/core';
import { TraderService } from '../trader.service';
import { debounceTime } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.scss'],
})
export class CoinsComponent implements OnInit {
  page = 1;
  perPage = 50;
  total = 0;
  searchKey: any = '';
  refreshInterval: any;
  currentPrice: any;
  allCoinList: Array<any> = [];
    searchControl: FormControl = new FormControl('');
  constructor(private _traderService: TraderService) {}

  ngOnInit(): void {
    this.getAllCoinListWma();
    this.refreshInterval = setInterval(() => {
      this.getAllCoinListWma();
    }, 10000);
    this.searchControl.valueChanges.pipe(debounceTime(550))  
    
  }
  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
  // get all active coin list
  getAllCoinListWma() {
    this._traderService.getAllCoinListWma(this.searchKey).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allCoinList = res.data;
          // Fetch current price for each coin
          this.allCoinList.forEach((coin: any) => {
            this._traderService
              .getCurrentPriceByTicker(coin.ticker_symbol)
              .subscribe({
                next: (res: any) => {
                  coin.currentPrice = res.data.currentPrice; // Assuming the API response contains `price`
                },
                error: (err: any) => {
                },
              });
          });
        } else {
          this.allCoinList = [];
        }
      },
      error: (err: any) => {
      },
    });
  }
  getSearchInput(searchKey: any){
    this.searchKey = searchKey;
    this.getAllCoinListWma();
  }
}
