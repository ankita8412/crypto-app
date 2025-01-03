import { Component, OnInit } from '@angular/core';
import { TraderService } from '../../trader/trader.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-admin-coins',
  templateUrl: './admin-coins.component.html',
  styleUrls: ['./admin-coins.component.scss'],
})
export class AdminCoinsComponent implements OnInit {
  page = 1;
  perPage = 50;
  total = 0;
  searchKey: any = '';
  searchControl: FormControl = new FormControl('');
  currentPrice: any;
  allCoinList: Array<any> = [];
  refreshInterval: any;
  isLoading = false;
  constructor(private _traderService: TraderService) {}
  ngOnInit(): void {
    this.refreshInterval = setInterval(() => {
      this.getAllCoinList();
    }, 5000);
    this.searchControl.valueChanges.pipe(debounceTime(550))
  }
  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
  // get all active coin list
  getAllCoinList() {
    this._traderService.getAllCoinList(this.searchKey).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allCoinList = res.data;
          this.isLoading = true;
        } else {
          this.allCoinList = [];
          this.isLoading = false;
        }
      },
    });
  }
  getSearchInput(searchKey: any){
    this.searchKey = searchKey;
    this.getAllCoinList();
  }
}
