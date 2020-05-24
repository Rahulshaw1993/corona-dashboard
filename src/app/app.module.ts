import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { DataServiceService } from './data-service.service';
import {MatDialogModule} from '@angular/material/dialog';
import { PopupComponent } from './popup/popup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import {MatDividerModule} from '@angular/material/divider';
import { MatButtonModule, MatSidenavModule, MatIconModule,MatListModule,MatFormFieldModule, MatInputModule, MatSortModule,} from '@angular/material';
import { WorldDashboardComponent } from './world-dashboard/world-dashboard.component';
import { MatPaginatorModule } from '@angular/material';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PopupComponent,
    WorldDashboardComponent
  ],
  entryComponents: [
    PopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatCardModule,
    MatTableModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule,
    ChartsModule,
    MatDividerModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule

  ],
  providers: [DataServiceService,{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
