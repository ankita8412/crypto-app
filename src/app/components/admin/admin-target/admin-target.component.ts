import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SetTargetComponent } from './set-target/set-target.component';
import { TraderService } from '../../trader/trader.service';

@Component({
  selector: 'app-admin-target',
  templateUrl: './admin-target.component.html',
  styleUrls: ['./admin-target.component.scss']
})
export class AdminTargetComponent implements OnInit{

   page = 1;
    perPage = 50;
    total = 0;
    searchKey: any = '';
    allSetTargetList:Array<any> = [];
    updateStatus:Array<any> = [];
    refreshInterval: any;
    constructor(private dialog: MatDialog,private _traderService:TraderService){}
  
    ngOnInit(): void {
      this.getAllSetTargetList();
      // Set up the interval
      this.refreshInterval = setInterval(() => {
       this.UpdateCurrentPriceStatus();
       
      }, 30000);
    }
    ngOnDestroy() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
      }
    }
    // get all set target list
    getAllSetTargetList(){
      this._traderService.getAllSetTargetList(this.page,this.perPage).subscribe({
        next: (res: any) => {
          console.log("getAllSetTargetList",res);
          
          if (res.data.length > 0) {
            this.allSetTargetList = res.data;
            this.UpdateCurrentPriceStatus();
            // this.total = res.pagination.total;
          } else {
            this.allSetTargetList = [];
            // this.total = 0
          }
        }
      });
    }

    UpdateCurrentPriceStatus(){
      this._traderService.UpdateCurrentPriceStatus().subscribe({
        next:(res:any) => {
          console.log("UpdateCurrentPriceStatus",res);
          if(res.data){
            this.updateStatus = res.data;
          }else{
            this.updateStatus = [];
          }
        }
      })
    }
    // onPageChange(event: PageEvent): void {
    //   this.page = event.pageIndex + 1;
    //   this.perPage = event.pageSize;
    //   this.getAllSetTargetList();
    // }
    //open ...view sports
    openDialog(data?: any) {
      const dialogRef = this.dialog.open(SetTargetComponent, {
        data: data,
        width: '70%',
        panelClass:'mat-mdc-dialog-container'
      });
      dialogRef.afterClosed().subscribe((message: any) => {
        if (message) {
          this.getAllSetTargetList();
        } else {
          console.log('nothing happen');
        }
      });
    }
  
  }
  
