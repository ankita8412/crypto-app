import { Component, OnInit } from '@angular/core';
import { TraderService } from '../trader.service';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss'],
})
export class TargetComponent implements OnInit {
  page = 1;
  perPage = 50;
  total = 0;
  searchKey: any = '';
  allSetTargetList: Array<any> = [];
  allCurrentPriceList: Array<any> = [];
  updateStatus: Array<any> = [];
  refreshInterval1: any;
  refreshInterval2: any;
  currentPrice: any;
  allCoinList: Array<any> = [];
  tickerSymbol: any;
  currant_price: any;
  coin: any;
  complition_id: any;
  untitled_id: any;
  // isLoading: boolean = false;
  totalCurrentValue :any
  searchControl: FormControl = new FormControl('');
  constructor(
    private _traderService: TraderService,
    private _toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    let data: any = localStorage.getItem('data');
    this.untitled_id = JSON.parse(data)?.untitled_id;
    this.getAllSetTargetList();
    this.setIntervalApi();
    this.searchControl.valueChanges.pipe(debounceTime(550))

  }
  setIntervalApi() {
    // Interval for running every 10 seconds
    this.refreshInterval2 = setInterval(() => {
      if (this.allSetTargetList.length > 0) {
        
        this.addupdateCurrentPrice();
      }
    }, 10000);

    // Interval for running every 7 seconds
    this.refreshInterval1 = setInterval(() => {
      if (this.allSetTargetList.length > 0) {
      this.updateTargetCompitionStatus();
      this.getAllSetTargetList();
      }
    }, 15000);


  }

  ngOnDestroy() {
    if (this.refreshInterval2) {
      clearInterval(this.refreshInterval2);
    }
    if (this.refreshInterval1) {
      clearInterval(this.refreshInterval1);
    }
   
  }
  getSearchInput(searchKey: any) {
    this.searchKey = searchKey;
    this.getAllSetTargetList();
  }
  getAllSetTargetList(): void {
    this._traderService.getAllSetTargetList(this.page, this.perPage, this.searchKey).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allSetTargetList = res.data;
          this.totalCurrentValue = res.totalCurrentValue;
          this.total = res.pagination.total;
        } else {
          this.allSetTargetList = [];
          this.total = 0 ;
        }
      },
      error: (err: any) => {
        console.error('Error fetching target list:', err);
      },
    });
  }

  // Helper function to extract the ticker symbol
  extractTickerSymbol(coin: string): string | null {
    const match = coin.match(/\(([^)]+)\)/); // Regex to extract text within parentheses
    return match ? match[1] : null;
  }
  // getCurrentPrice(
  //   tickerSymbol: string,
  //   callback: (price: number | null) => void
  // ): void {
  //   if (!tickerSymbol) {
  //     callback(null);
  //     return;
  //   }
  //   this._traderService.getCurrentPriceByTicker(tickerSymbol).subscribe({
  //     next: (res: any) => callback(res.data?.currentPrice || null),
  //     error: () => callback(null),
  //   });
  // }
  // get current price
  // UpdateCurrentPriceStatus(): void {

  // }
  updateTargetCompitionStatus() {
    this._traderService.updateTargetCompitionStatus().subscribe({
      next: (res: any) => {
        if (res.status == 201 || res.status == 200) {
          // this._toastrService.success(res.message);

        } else {
          this._toastrService.error(res.message);
        }
      },

    });
  }
  addupdateCurrentPrice() {
    this._traderService.addupdateCurrentPrice('').subscribe({
      next: (res: any) => {
        if (res.status == 201 || res.status == 200) {
          // this._toastrService.success(res.message);

        } else {
          this._toastrService.error(res.message);
        }
      },

    });
  }
  getAllCurrentPriceList(callback: () => void): void {
    this._traderService.getAllCurrentPriceList().subscribe({
      next: (res: any) => {
        if (res.status === 201 || res.status === 200) {
          this.allCurrentPriceList = res.data;
          this.totalCurrentValue = res.totalCurrentValue
          callback();
        } else {
          this.allCurrentPriceList = [];
          this.totalCurrentValue = 0
          callback();
        }
      }
    });
  }

  submit(item: any, footer: any, currentPrice: any) {
    Swal.fire({
      text: 'Do you want to Sell?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      customClass: {
        popup: 'small-swal', // Add a custom class
      },
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.updateSellToSoldStatus(item, footer, currentPrice);
        // this.isLoading = true;
      }
    });
  }

  updateSellToSoldStatus(item: any, footer: any, currentPrice: any) {
    if (!currentPrice || currentPrice === '--') {
      return;
    }
    if (!footer.set_footer_id) {
      return;
    }
    const body = {
      sale_target_id: item.sale_target_id,
      complition_id: footer.complition_id,
      currant_price: currentPrice,
      set_footer_id: footer.set_footer_id,
      coin: item.coin,
      base_price: item.base_price,
      total_coins : item.total_available_coins,
    };
    this._traderService.updateSellToSoldStatus(body).subscribe({
      next: (res: any) => {
        if (res.status == 201 || res.status == 200) {
          // this.isLoading = false;
          this.getAllSetTargetList();
          this._toastrService.success(res.message);
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
      }
    });
  }
  downloadReport() {
    this._traderService.downloadReport().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Sale-Target-Report.xlsx';  // Set a proper filename
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err: any) => {
        if (err.error.status == 401 || err.error.status == 422) {
          this._toastrService.warning(err.error.message);
        } else {
          this._toastrService.warning('No Data Found');
        }
      }
    })
  }
  //delete record
  deleteRecord(event: any, id: any) {
    let status = event.checked ? 1 : 0;
  
   Swal.fire({
               text: 'Do you want to Delete ?',
               icon: 'question',
               showCancelButton: true,
               confirmButtonColor: '#3085d6',
               cancelButtonColor: '#d33',
               confirmButtonText: 'Yes',
               customClass: {
                 popup: 'small-swal' // Add a custom class
               }
             }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        this._traderService.deleteRecordById(id, status).subscribe({
          next: ({ message }: any) => {
            this._toastrService.clear();
            this._toastrService.success(message);
            this.getAllSetTargetList();
          },
          error: ({ status, message }: any) => {
            if (status === 422) this._toastrService.warning(message);
          }
        });
      }
    });
  }
  
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.perPage = event.pageSize;
    this.getAllSetTargetList();
  }
  refreshPage() {
    // window.location.reload();
    if (this.allSetTargetList.length > 0) {
      this.addupdateCurrentPrice();
      this.updateTargetCompitionStatus();
      this.getAllSetTargetList();
      }
  }
//   formatAvailableCoins(value: any): string {
//     if (value == null || isNaN(Number(value))) return "0";
//     if (Number(value) === 0) return "0";
//     let formattedValue = (Math.floor(Number(value) * 10000) / 10000).toFixed(4);
//     if (formattedValue.endsWith(".0000")) {
//         return formattedValue.slice(0, -5);
//     }
//     if (/\.\d+0+$/.test(formattedValue) && !formattedValue.endsWith(".1000") && !formattedValue.endsWith(".2000") && !formattedValue.endsWith(".3000")) {
//         return formattedValue.replace(/0+$/, "");
//     }

//     return formattedValue;
// }
formatAvailableCoins(value: any): string {
  if (value == null || isNaN(Number(value))) return "0";
  if (Number(value) === 0) return "0";

  let num = Number(value);
  
  // Convert to string and check if it has more than 8 decimal places
  let numStr = num.toString();
  if (numStr.includes('.') && numStr.split('.')[1].length > 8) {
      num = Math.floor(num * 100000000) / 100000000; // Truncate to 8 decimal places
  }

  let formattedValue = num.toFixed(8).replace(/0+$/, ""); // Remove trailing zeros

  if (formattedValue.endsWith(".")) {
      formattedValue = formattedValue.slice(0, -1);
  }

  return formattedValue;
}

}
