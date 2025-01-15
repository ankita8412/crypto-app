import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { TraderService } from '../../trader/trader.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit{
  userCount :Array<any> = [];
  page = 1;
  perPage = 50;
  total = 0;
  searchKey: any = '';
  complition_id: any;
  untitled_id: any;
  setTargetCount:any;
  allReachedSetTargetList: Array<any> = [];
  allCurrentPriceList: Array<any> = [];
  searchControl: FormControl = new FormControl('');
  allSetTargetList: Array<any> = [];
  updateStatus: Array<any> = [];
  refreshInterval1: any;
  refreshInterval2: any;
  currentPrice: any;
  allCoinList: Array<any> = [];
  tickerSymbol: any;
  currant_price: any;
  isLoading: boolean = false;
  constructor(
    private _adminService: AdminService,
     private _traderService: TraderService,
     private _toastrService:ToastrService
  ) {}

  ngOnInit(): void {
    this.getDashboardCount();
    this.getdashboardSaleTargetCount();
    let data: any = localStorage.getItem('data');
    this.untitled_id = JSON.parse(data)?.untitled_id;
    this.getAllReachedSetTargetList();
    this.searchControl.valueChanges.pipe(debounceTime(550))  
    this.setIntervalApi();
  }
  setIntervalApi() {
    // Interval for running every 10 seconds
    this.refreshInterval2 = setInterval(() => {
      this.addupdateCurrentPrice();
    }, 8000);

    // Interval for running every 7 seconds
    this.refreshInterval1 = setInterval(() => {
      this.updateTargetCompitionStatus();
      this.getAllReachedSetTargetList();
    }, 10000);
  

  }
  
  ngOnDestroy() {
    if (this.refreshInterval1) {
      clearInterval(this.refreshInterval1);
    }
    // if (this.refreshInterval2) {
    //   clearInterval(this.refreshInterval2);
    // }
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
          this.total = res.pagination.total;

           // Fetch the current price list once and then map the prices
           this.getAllCurrentPriceList(() => {
            this.allReachedSetTargetList.forEach((item: any) => {
              const tickerSymbol = item.ticker;
  
              // Find the matching ticker in the current price list
              if (tickerSymbol) {
                const matchedItem = this.allCurrentPriceList?.find(
                  (priceItem: any) => priceItem.ticker === tickerSymbol
                );
                item.currentPrice = matchedItem ? matchedItem.current_price : '--'; // Set current price or default value
              } else {
                item.currentPrice = '--'; // Default value if no ticker
              }
            });
          });
        }
        else{
          this.allReachedSetTargetList = [];
          this.total = 0 ;
        }
      }
    })
  }

  getDashboardCount(){
    this._adminService.getdashboardUserCount().subscribe({
      next:(res:any) => {
        this.userCount = res.admin_user_count;
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
            callback(); 
          } else {
            this.allCurrentPriceList = [];
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
        this._adminService.updateSellToSoldStatus(body).subscribe({
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
}
