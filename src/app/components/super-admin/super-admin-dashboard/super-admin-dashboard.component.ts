import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AdminService } from '../../admin/admin.service';
import { TraderService } from '../../trader/trader.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { SuperAdminService } from '../super-admin.service';

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.scss']
})
export class SuperAdminDashboardComponent implements OnInit {
  userCount: Array<any> = [];
  searchUsersValue = '';
  page = 1;
  perPage = 50;
  total = 0;
  searchKey: any = '';
  complition_id: any;
  untitled_id: any;
  setTargetCount: any;
  allReachedSetTargetList: Array<any> = [];
  allCurrentPriceList: Array<any> = [];
  allUsersWmaList: Array<any> = [];
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
  form!:FormGroup;
  untitledwm_id : any;
  constructor(
    private _adminService: AdminService,
    private _traderService: TraderService,
    private _toastrService: ToastrService,
    private fb:FormBuilder,
    private _superAdminService : SuperAdminService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getDashboardCount();
    this.getdashboardSaleTargetCount();
    let data: any = localStorage.getItem('data');
    this.untitled_id = JSON.parse(data)?.untitled_id;
    this.getAllReachedSetTargetList();
    this.searchControl.valueChanges.pipe(debounceTime(550))
    this.setIntervalApi();
    this.getAllUsersListWma();

  }

  createForm(){
    this.form = this.fb.group({
      untitledwm_id: [null]
    });
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

  getAllReachedSetTargetList(){
    this._superAdminService.getAllReachedSetTargetList(this.searchKey,this.page,this.perPage,this.untitledwm_id).subscribe({
      next:(res:any) => {
        if (res.data.length > 0){
          this.allReachedSetTargetList = res.data
          this.total = res.pagination.total;
        }
        else{
          this.allReachedSetTargetList = [];
          this.total = 0 ;
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
    this._superAdminService.addupdateCurrentPrice('').subscribe({
      next: (res: any) => {
        if (res.status == 201 || res.status == 200) {
          // this._toastrService.success(res.message);

        } else {
          this._toastrService.error(res.message);
        }
      },

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
    if (this.allReachedSetTargetList.length > 0) {
       // window.location.reload();
    this.addupdateCurrentPrice();
    this.updateTargetCompitionStatus();
        this.getAllReachedSetTargetList();
    }
   
  }

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
  getAllUsersListWma(){
    this._superAdminService.getAllUsersListWma().subscribe({
      next: (res: any) => {
        if (res.status === 201 || res.status === 200) {
          this.allUsersWmaList = res.data;
        } else {
          this.allUsersWmaList = [];
        }
      }
    });
  }
    //Filter user array
    filterUsers() {
      if (this.searchUsersValue !== "") {
        this.allUsersWmaList = this.allUsersWmaList.filter((obj) =>
          obj.service_name.toLowerCase().includes(this.searchUsersValue.toLowerCase())
        );
      } else {
        this.allUsersWmaList = this.allUsersWmaList;
      }
    }
    onUserSelectionChange(selectedUserId: string) {
      this.untitledwm_id = selectedUserId
    this.getAllReachedSetTargetList();
    }
}
