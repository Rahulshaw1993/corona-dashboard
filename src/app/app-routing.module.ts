import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WorldDashboardComponent } from './world-dashboard/world-dashboard.component';


const routes: Routes = [
  {path:'', component: WorldDashboardComponent},
  {path:'world-covid-19-dashboard', component: WorldDashboardComponent},
  {path:'india-covid-19-dashboard', component: HomeComponent},
  {path:'**', component: WorldDashboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
