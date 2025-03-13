import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TraderService } from '../../trader/trader.service';
import { debounceTime } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { SuperAdminService } from '../super-admin.service';
import { AdminService } from '../../admin/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-super-admin-sold-coins',
  templateUrl: './super-admin-sold-coins.component.html',
  styleUrls: ['./super-admin-sold-coins.component.scss']
})
export class SuperAdminSoldCoinsComponent implements OnInit{
  page = 1;
  perPage = 50;
  total = 0;
  searchKey: any = '';
  searchControl: FormControl = new FormControl('');
  allSoldSetTargetList: Array<any> = [];
  totalCurrentValue:any;
  form!:FormGroup;
  untitledwm_id : any;
  searchUsersValue = '';
  allUsersWmaList: Array<any> = [];
  constructor(private _adminService: AdminService,private _traderService: TraderService,private _toastrService:ToastrService, private fb:FormBuilder,
    private _superAdminService : SuperAdminService) {}
  ngOnInit(): void {
    this.createForm();
    this.getAllUsersListWma();
    this.getAllSoldSetTargetList();
    this.searchControl.valueChanges.pipe(debounceTime(550))
  }
  
  createForm(){
    this.form = this.fb.group({
      untitledwm_id: [null]
    });
  }
  // get all active coin list
  getAllSoldSetTargetList() {
    this._superAdminService.getAllSoldSetTargetList(this.searchKey,this.page,this.perPage,this.untitledwm_id).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allSoldSetTargetList = res.data;
          this.totalCurrentValue = res.totalSum;
          this.total = res.pagination.total;
        } else {
          this.allSoldSetTargetList = [];
          this.total = 0 ;
        }
      },
    });
  }
  getSearchInput(searchKey: any){
    this.searchKey = searchKey;
    this.getAllSoldSetTargetList();
  }
    onPageChange(event: PageEvent): void {
      this.page = event.pageIndex + 1;
      this.perPage = event.pageSize;
      this.getAllSoldSetTargetList();
    }
    downloadSoldReport(){
      this._traderService.downloadSoldReport().subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'Sold-Coin-Report.xlsx';  // Set a proper filename
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
      // window.location.reload();
      if (this.allSoldSetTargetList.length > 0) {
        this.getAllSoldSetTargetList();
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
      this.getAllSoldSetTargetList();
      }
    
}

