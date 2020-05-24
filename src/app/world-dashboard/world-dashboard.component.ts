import { Component, OnInit, ViewChild } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';


declare let am4geodata_worldLow: any;
declare let am4core: any;
declare let am4maps: any;
declare let am4themes_animated: any;

export interface worldData {
  country: string,
  cases: Number,
  todayCases: Number,
  deaths: Number,
  todayDeaths: Number,
  recovered: Number,
  active: Number,
  critical: Number,
  casesPerOneMillion: Number,
  deathsPerOneMillion: Number
}

@Component({
  selector: 'app-world-dashboard',
  templateUrl: './world-dashboard.component.html',
  styleUrls: ['./world-dashboard.component.css']
})
export class WorldDashboardComponent implements OnInit {
  cardData: any = {}
  countryDataArray: any = [];
  countryChartData: any = []
  displayedColumns: string[] = ['country', 'cases', 'deaths', 'recovered', 'active'];
  dataSource: MatTableDataSource<worldData>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  innerWidth: number;
  lastUpdated: any;
  isNow = 'primary';
  isYesterday: string;
  constructor(private dataService: DataServiceService) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.dataService.getWorldData().subscribe((data: any) => {
      this.lastUpdated = moment().fromNow()

    })
    this.getCountryData();
  }

  async getCountryData() {
    let india:any = await this.dataService.getData().toPromise();
    let country:any = await this.dataService.getWorldCountryData().toPromise();
      this.countryDataArray = country;
      let totalCases = 0;
      let totalRecovered = 0;
      let totalDeath = 0;
      let todayCases = 0;
      let todayDeaths = 0;
      let totalActiveCases = 0;
      this.countryDataArray.sort((a, b) => parseFloat(b.cases) - parseFloat(a.cases));
      this.countryDataArray.forEach(element => {
          if(element.country === 'India'){
            element.cases = Number(india.statewise[0].confirmed);
            element.recovered = Number( india.statewise[0].recovered);
            element.deaths = Number(india.statewise[0].deaths);
            element.active = Number(india.statewise[0].active);
            element.todayCases = Number(india.statewise[0].deltaconfirmed);
            element.todayDeaths = Number(india.statewise[0].deltadeaths);
          }
          totalCases += element.cases;
          totalRecovered += element.recovered;
          totalDeath += element.deaths;
          todayCases += element.todayCases;
          todayDeaths += element.todayDeaths;
          totalActiveCases += element.active;
          let depth = Math.log10(element.cases)/Math.log10(this.countryDataArray[0].cases);
          let chartObject = {
            id: element.countryInfo.iso2,
            name: element.country,
            confirmed: element.cases,
            death: element.deaths,
            totalRecovered: element.recovered,
            fill: ''
          }

          if (element.cases) {
            chartObject.fill = `rgba(255, 0, 0, ${depth})`
          } else {
            chartObject.fill = "rgba(11, 214, 0, 0.6)"
          }
  
      this.countryChartData.push(chartObject);
    });
      this.cardData.cases = totalCases;
      this.cardData.deaths = totalDeath;
      this.cardData.recovered = totalRecovered;
      this.cardData.todayCases = todayCases;
      this.cardData.todayDeaths = todayDeaths;
      this.cardData.active = totalActiveCases;
      this.dataSource = new MatTableDataSource(this.countryDataArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.plotGlobeChart();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  plotGlobeChart() {
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("chartdiv", am4maps.MapChart);

    // Set map definition
    chart.geodata = am4geodata_worldLow;

    // Set projection
    chart.projection = new am4maps.projections.Orthographic();
    chart.panBehavior = "rotateLongLat";
    chart.deltaLatitude = -20;
    chart.padding(20, 20, 20, 20);

    // limits vertical rotation
    chart.adapter.add("deltaLatitude", function (delatLatitude) {
      return am4core.math.fitToRange(delatLatitude, -90, 90);
    })

    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;
    polygonSeries.tooltip.getFillFromObject = false;
    polygonSeries.tooltip.background.fill = "#fff";
    polygonSeries.tooltip.autoTextColor = false;
    polygonSeries.tooltip.label.fill = "#000";

    // Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipHTML = `<center><strong><span style="font-size:20px;">{name}</span></strong></center><hr /><div style="font-size:16px;"> Confirmed: {confirmed} <br/> Recovered: {totalRecovered} <br/> Deaths: {death}</div>`;
    polygonTemplate.fill = am4core.color("#47c78a");
    polygonTemplate.stroke = am4core.color("#454a58");
    polygonTemplate.strokeWidth = 0.5;

    let graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
    graticuleSeries.mapLines.template.line.stroke = am4core.color("#ffffff");
    graticuleSeries.mapLines.template.line.strokeOpacity = 0.08;
    graticuleSeries.fitExtent = false;


    chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 1;
    chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#AADAFF");

    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(0).brighten(-0.5);

    if (this.innerWidth > 720) {
      let animation;
      setTimeout(function () {
        animation = chart.animate({ property: "deltaLongitude", to: 100000 }, 20000000);
      }, 3000)

      chart.seriesContainer.events.on("down", function () {
        if (animation) {
          animation.stop();
        }
        setTimeout(() => {
          animation = chart.animate({ property: "deltaLongitude", to: 100000 }, 20000000);
        }, 10000);
      })

    }

    polygonSeries.data = this.countryChartData;
    polygonTemplate.propertyFields.fill = "fill";
  }

  getData(type){
    if(type==='Now'){
      this.dataService.getWorldCountryData().subscribe((data: any) =>{
        data.sort((a, b) => parseFloat(b.cases) - parseFloat(a.cases));
        this.dataSource = new MatTableDataSource(data);
        this.isNow = 'primary';
        this.isYesterday = '';
      });
    } else{
      this.dataService.getYesterdayCountryData().subscribe((data: any) =>{
        data.sort((a, b) => parseFloat(b.cases) - parseFloat(a.cases));
        this.dataSource = new MatTableDataSource(data);
        this.isNow = '';
      this.isYesterday = 'primary';
      });
    }
  }

}
