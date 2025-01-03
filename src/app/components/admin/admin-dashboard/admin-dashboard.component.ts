import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit{

  page = 1;
  perPage = 50;
  total = 0;
  searchKey: any = '';
  allReachedSetTargetList: Array<any> = [];
  userCount :Array<any> = [];
  setTargetCount:Array<any> = [];
  untitled_id: any;
  searchControl: FormControl = new FormControl('');
  constructor(
    private _adminService: AdminService,
  ) {}

  ngOnInit(): void {
    this.getDashboardCount();
    this.getdashboardSaleTargetCount();
    let data: any = localStorage.getItem('data');
    this.untitled_id = JSON.parse(data)?.untitled_id;
    this.getAllReachedSetTargetList();
    this.searchControl.valueChanges.pipe(debounceTime(550))  
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
        }
        else{
          this.allReachedSetTargetList = [];
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

  // onPageChange(event: PageEvent): void {
  //   this.page = event.pageIndex + 1;
  //   this.perPage = event.pageSize;
  //   this.getAllReachedSetTargetList();
  // }
}
