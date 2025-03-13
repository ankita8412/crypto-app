import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TraderService } from '../../trader/trader.service';
import { AdminService } from '../../admin/admin.service';
import { debounceTime } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { SuperAdminService } from '../super-admin.service';

@Component({
  selector: 'app-super-admin-trader',
  templateUrl: './super-admin-trader.component.html',
  styleUrls: ['./super-admin-trader.component.scss']
})
export class SuperAdminTraderComponent implements OnInit {
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
      totalCurrentValue :any;
        form!:FormGroup;
        untitledwm_id : any;
        allUsersWmaList: Array<any> = [];
        searchUsersValue = '';
      // isLoading: boolean = false;
      searchControl: FormControl = new FormControl('');
      constructor(
        private _traderService: TraderService,
        private _toastrService:ToastrService,
        private _adminService:AdminService,
           private fb:FormBuilder,
       private _superAdminService : SuperAdminService,
      ) {}
    
      ngOnInit(): void {
        this.createForm();
        let data: any = localStorage.getItem('data');
        this.untitled_id = JSON.parse(data)?.untitled_id;
        this.getAllSetTargetList();
        this.getAllUsersListWma();
        this.setIntervalApi();
        this.searchControl.valueChanges.pipe(debounceTime(550))  
  
      }
      createForm(){
        this.form = this.fb.group({
          untitledwm_id:[null]
        });
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
        }, 17000);
      
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
        
        this.getAllSetTargetList();
      }

      getAllSetTargetList(): void {

        this._superAdminService.getAllSetTargetList(this.searchKey,this.page, this.perPage, this.untitledwm_id).subscribe({
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

      onPageChange(event: PageEvent): void {
        this.page = event.pageIndex + 1;
        this.perPage = event.pageSize;
        this.getAllSetTargetList();
      }
      refreshPage() {
        // window.location.reload();
        if (this.allSetTargetList.length > 0) {
          this.updateTargetCompitionStatus();
          this.getAllSetTargetList();
          this.addupdateCurrentPrice();
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
        this.getAllSetTargetList();
        }
    }