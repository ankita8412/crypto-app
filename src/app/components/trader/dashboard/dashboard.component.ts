import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin/admin.service';
import { FormControl } from '@angular/forms';
import { TraderService } from '../trader.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

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
    allReachedSetTargetList: Array<any> = [];
    searchControl: FormControl = new FormControl('');
    allSetTargetList: Array<any> = [];
    updateStatus: Array<any> = [];
    refreshInterval: any;
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
      this.getdashboardSaleTargetCount();
      let data: any = localStorage.getItem('data');
      this.untitled_id = JSON.parse(data)?.untitled_id;
      this.getAllReachedSetTargetList();
      this.setIntervalApi();
    }
    setIntervalApi(){
      this.refreshInterval = setInterval(() => {
        this.UpdateCurrentPriceStatus();
      this.updateTargetCompitionStatus();
      // this.getAllSetTargetList();
      }, 7000);
      }
    ngOnDestroy() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
      }
    }
    getSearchInput(searchKey: any){
      this.searchKey = searchKey;
      this.getAllReachedSetTargetList();
    }  

    getAllReachedSetTargetList(){
      this._adminService.getAllReachedSetTargetList(this.searchKey).subscribe({
        next:(res:any) => {
          if (res.data.length > 0){
            this.allReachedSetTargetList = res.data
            console.log( this.allReachedSetTargetList);
            
          }
          else{
            this.allReachedSetTargetList = [];
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
    getCurrentPrice(
      tickerSymbol: string,
      callback: (price: number | null) => void
    ): void {
      if (!tickerSymbol) {
        callback(null);
        return;
      }
      this._traderService.getCurrentPriceByTicker(tickerSymbol).subscribe({
        next: (res: any) => callback(res.data?.currentPrice || null),
        error: () => callback(null),
      });
    }
    // get current price
    UpdateCurrentPriceStatus(): void {
      this.allReachedSetTargetList.forEach((item: any) => {
        this.tickerSymbol = item.ticker; // Dynamically extract tickerSymbol
        if (this.tickerSymbol) {
          this.getCurrentPrice(this.tickerSymbol, (currentPrice) => {
            item.currentPrice = currentPrice || '--'; // Add current price to the item
          });
        } else {
          item.currentPrice = '--'; // Default value if no ticker symbol
        }
      });
    }
    updateTargetCompitionStatus() {
      this._traderService.updateTargetCompitionStatus().subscribe({
        next: (res: any) => {
          // if (res.status == 201 || res.status == 200) {
          //   this._toastrService.success(res.message);
         
          // } else {
          //   this._toastrService.warning(res.message);
          // }
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
          complition_id: 4,
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
    // onPageChange(event: PageEvent): void {
    //   this.page = event.pageIndex + 1;
    //   this.perPage = event.pageSize;
    //   this.getAllReachedSetTargetList();
    // }
  
  }
  