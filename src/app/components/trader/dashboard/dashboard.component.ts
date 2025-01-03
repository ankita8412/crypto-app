import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin/admin.service';
import { FormControl } from '@angular/forms';

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
    constructor(
      private _adminService: AdminService,
    ) {}
  
    ngOnInit(): void {
      this.getdashboardSaleTargetCount();
      let data: any = localStorage.getItem('data');
      this.untitled_id = JSON.parse(data)?.untitled_id;
      this.getAllReachedSetTargetList();
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
  