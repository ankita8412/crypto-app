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
export class AdminDashboardComponent implements OnInit {
  userCount: Array<any> = [];
  page = 1;
  perPage = 50;
  total = 0;
  searchKey: any = '';
  complition_id: any;
  untitled_id: any;
  setTargetCount: any;
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
  totalCurrentValue: any
  isLoading: boolean = false;
  constructor(
    private _adminService: AdminService,
    private _traderService: TraderService,
    private _toastrService: ToastrService
  ) { }

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
  getSearchInput(searchKey: any) {
    this.searchKey = searchKey;
    this.getAllReachedSetTargetList();
  }

  getAllReachedSetTargetList() {
    this._adminService.getAllReachedSetTargetList(this.searchKey, this.page, this.perPage).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allReachedSetTargetList = res.data
          // Sort the list by marketCap in descending order
          this.allReachedSetTargetList.sort((a, b) => {
            if (a.marketCap === '--' || b.marketCap === '--') return 0;
            return b.marketCap - a.marketCap; // Sorting in descending order
          });
          this.total = res.pagination.total;

        }
        else {
          this.allReachedSetTargetList = [];
          this.total = 0;
        }
      }
    })
  }

  getDashboardCount() {
    this._adminService.getdashboardUserCount().subscribe({
      next: (res: any) => {
        this.userCount = res.admin_user_count;
      }
    })
  }
  getdashboardSaleTargetCount() {
    this._adminService.getdashboardSaleTargetCount().subscribe({
      next: (res: any) => {
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
          this._toastrService.clear();
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
          this.totalCurrentValue = 0;
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
      total_coins: item.total_available_coins,
    };
    this._adminService.updateSellToSoldStatus(body).subscribe({
      next: (res: any) => {
        if (res) {
          this.isLoading = false;
          this.getAllReachedSetTargetList();
          this._toastrService.success(res.message);
        } else {
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
  downloadDashboardReport() {
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
  shouldShowAsInteger(value: number): boolean {
    return Number(value) % 1 === 0 || /^(\d+)\.0+$/.test(value.toString());
  }
  formatAvailableCoins(value: number): string {
    if (value == null) return "0"; // Agar value null ya undefined ho to "0" show kare
  
    // Agar value integer hai ya decimal part sirf zero hai to sirf integer dikhaye
    if (Number(value) % 1 === 0 || /^(\d+)\.0+$/.test(value.toString())) {
      return Number(value).toFixed(0); // Poora integer rakhe (e.g., "10" instead of "10.0000")
    }
  
    return Number(value).toFixed(4); // Otherwise, 4 decimal places tak dikhaye
  }
}
