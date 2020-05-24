import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  displayedColumns: string[] = ['state', 'confirmed'];
  dataSource;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 
    this.dataSource = this.data.data;
    this.dataSource.sort((a, b) => parseFloat(b.district.data.confirmed) - parseFloat(a.district.data.confirmed));
   }

  ngOnInit() {
  }

}
