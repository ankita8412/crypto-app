import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin/admin.service';
import { FormControl } from '@angular/forms';
import { TraderService } from '../trader.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
    page = 1;
    perPage = 50;
    total = 0;
    searchKey: any = '';
    complition_id: any;
    untitled_id: any;
    setTargetCount:any;
    allCurrentPriceList: Array<any> = [];
    allReachedSetTargetList: Array<any> = [];
    searchControl: FormControl = new FormControl('');
    allSetTargetList: Array<any> = [];
    updateStatus: Array<any> = [];
    refreshInterval1: any;
    refreshInterval2: any;
    currentPrice: any;
    allCoinList: Array<any> = [];
    tickerSymbol: any;
    currant_price: any;
    totalCurrentValue :any
    isLoading: boolean = false;
    constructor(
      private _adminService: AdminService,
       private _traderService: TraderService,
       private _toastrService:ToastrService
    ) {}
  
    ngOnInit(): void {
      this.getdashboardSaleTargetCount();
      let data: any = localStorage.getItem('data');
      this.untitled_id = JSON.parse(data)?.untitled_id;
      this.getAllReachedSetTargetList();
      this.setIntervalApi();
    }
    setIntervalApi() {
       // Interval for running every 10 seconds
       this.refreshInterval2 = setInterval(() => {
        if (this.allReachedSetTargetList.length > 0) {
        this.addupdateCurrentPrice();
        }
      }, 10000);
      // Interval for running every 7 seconds
      this.refreshInterval1 = setInterval(() => {
        if (this.allReachedSetTargetList.length > 0) {
        this.updateTargetCompitionStatus();
        this.getAllReachedSetTargetList();
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
    getSearchInput(searchKey: any){
      this.searchKey = searchKey;
      this.getAllReachedSetTargetList();
    }  

    getAllReachedSetTargetList(){
      this._adminService.getAllReachedSetTargetList(this.searchKey,this.page,this.perPage).subscribe({
        next:(res:any) => {
          if (res.data.length > 0){
            this.allReachedSetTargetList = res.data
             // Fetch the current price list once and then map the prices
             this.getAllCurrentPriceList(() => {
              this.allReachedSetTargetList.forEach((item: any) => {
                const tickerSymbol = item.ticker;
        
            
                // Find the matching ticker in the current price list
                if (tickerSymbol) {
                  const matchedItem = this.allCurrentPriceList?.find(
                    (priceItem: any) => priceItem.ticker === tickerSymbol
                  );
                
                  // If matchedItem is found, set currentPrice, fdv_ratio, and market_cap
                  if (matchedItem) {
                    this.totalCurrentValue = this.totalCurrentValue;
                    item.currentPrice = matchedItem.current_price;
                    item.fdvRatio = matchedItem.fdv_ratio; // Set fdv_ratio from matchedItem
                    item.currentValue = matchedItem.current_value;
                    item.current_returnX = matchedItem.current_return_x; // Set current_returnX from matchedItem
                    item.marketCap = matchedItem.market_cap; // Set market_cap from matchedItem
                    item.currentPriceColor = '';
                  } else {
                    item.currentPrice = item.currant_price;
                    item.fdvRatio = item.fdv_ratio; // Default value if no fdv_ratio found
                    item.currentValue = item.current_value;
                    item.current_returnX = item.current_return_x; // Default value if no current_return_x found
                    item.marketCap = item.market_cap; // Default value for market_cap
                    item.currentPriceColor = 'red';
                  }
                } else {
                  this.totalCurrentValue = '--';
                  item.currentPrice = '--'; // Default value if no ticker
                  item.fdvRatio = '--'; // Default value for fdv_ratio if no ticker
                  item.currentValue = '--'; // Default value for current_value if no ticker
                  item.current_returnX = '--'; // Default value for current_return_x if no ticker
                  item.marketCap = '--'; // Default value for market_cap if no ticker
                }
                
              });
                       // Sort the list by marketCap in descending order
          this.allReachedSetTargetList.sort((a, b) => {
            if (a.marketCap === '--' || b.marketCap === '--') return 0;
            return b.marketCap - a.marketCap; // Sorting in descending order
          });
            });
            this.total = res.pagination.total;
          }
          else{
            this.allReachedSetTargetList = [];
            this.total = 0 ;
          }
        }
      })
    }
    getdashboardSaleTargetCount(){
      this._adminService.getdashboardSaleTargetCount().subscribe({
        next:(res:any) => {
          this.setTargetCount = res.set_target_count;
        }
      })
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
            this._toastrService.warning(res.message);
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
            this.isLoading = true;
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
        };
        this._traderService.updateSellToSoldStatus(body).subscribe({
          next: (res: any) => {
            if (res) {
              this.isLoading = false;
              this.getAllReachedSetTargetList();
              this._toastrService.success(res.message);
            }else {
              this._toastrService.warning(res.message);
            }
          }
        });
      }
    onPageChange(event: PageEvent): void {
      this.page = event.pageIndex + 1;
      this.perPage = event.pageSize;
      this.getAllReachedSetTargetList();
    }
    downloadDashboardReport(){
      this._traderService.downloadDashboardReport().subscribe({
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
    refreshPage() {
      window.location.reload();
    }
  }
  