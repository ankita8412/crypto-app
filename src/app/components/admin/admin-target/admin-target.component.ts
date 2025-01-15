import { AdminService } from './../admin.service';
import { Component, OnInit } from '@angular/core';
import { TraderService } from '../../trader/trader.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-admin-target',
  templateUrl: './admin-target.component.html',
  styleUrls: ['./admin-target.component.scss'],
})
export class AdminTargetComponent implements OnInit {
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
      searchControl: FormControl = new FormControl('');
      constructor(
        private _traderService: TraderService,
        private _toastrService:ToastrService,
        private _adminService:AdminService
      ) {}
    
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
          this.addupdateCurrentPrice();
        }, 8000);

        // Interval for running every 7 seconds
        this.refreshInterval1 = setInterval(() => {
          this.updateTargetCompitionStatus();
          this.getAllSetTargetList();
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
        this.getAllSetTargetList();
      }
      getAllSetTargetList(): void {
        this._traderService.getAllSetTargetList(this.page, this.perPage, this.searchKey).subscribe({
          next: (res: any) => {
            if (res.data.length > 0) {
              this.allSetTargetList = res.data;
      
              // Fetch the current price list once and then map the prices
          this.getAllCurrentPriceList(() => {
            this.allSetTargetList.forEach((item: any) => {
              const tickerSymbol = item.ticker;

              // Find the matching ticker in the current price list
              if (tickerSymbol) {
                const matchedItem = this.allCurrentPriceList?.find(
                  (priceItem: any) => priceItem.ticker === tickerSymbol
                );

                // If matchedItem is found, set currentPrice
                if (matchedItem) {
                  item.currentPrice = matchedItem.current_price;
                  item.currentPriceColor = '';
                } else {
                  item.currentPrice = item.currant_price;
                  item.currentPriceColor = 'red';

                }
              } else {
                item.currentPrice = '--'; // Default value if no ticker
              }
            });
          });
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
      // // get current price
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
        };
        this._adminService.updateSellToSoldStatus(body).subscribe({
          next: (res: any) => {
            if (res.status == 201 || res.status == 200) {
              // this.isLoading = false;
              this.getAllSetTargetList();
              this._toastrService.success(res.message);
            }else {
              this._toastrService.warning(res.message);
            }
          },
          error: (err: any) => {
            if (err.error.status == 401 || err.error.status == 422) {
              this._toastrService.warning(err.error.message);
            } else {
              // this._toastrService.error('Internal Server Error');
            }
          }
        });
      }
      downloadReport(){
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
      let status = 0;
      if (event.checked) {
        status = 1;
      }
      this._traderService.deleteRecordById(id, status).subscribe({
        next: (res: any) => {
          this._toastrService.success(res.message);
          // this._toastrService.clear();
          this.getAllSetTargetList();
        },
        error: (error: any) => {
          if (error.status == 422) {
            this._toastrService.warning(error.message);
          }
        },
      });
    }
      onPageChange(event: PageEvent): void {
        this.page = event.pageIndex + 1;
        this.perPage = event.pageSize;
        this.getAllSetTargetList();
      }
      
    }