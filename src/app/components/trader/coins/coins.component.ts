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
  searchControl: FormControl = new FormControl('');
  currentPrice: any;
  refreshInterval:any;
  allCoinList: Array<any> = [];
  constructor(private _traderService: TraderService) {}
  ngOnInit(): void {
    this.refreshInterval = setInterval(() => {
      this.getAllCoinList();
    }, 5000);
    this.searchControl.valueChanges.pipe(debounceTime(5000))
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
        } else {
          this.allCoinList = [];
        }
      },
    });
  }
  getSearchInput(searchKey: any){
    this.searchKey = searchKey;
    this.getAllCoinList();
  }
}
