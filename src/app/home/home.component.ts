import { Component, OnInit,ViewChild } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as moment from 'moment';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

declare let zingchart: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  displayedColumns: string[] = ['state', 'confirmed', 'active', 'recovered', 'deaths'];
  dataSource: any = [];
  isLoaded = false;
  changesData = [];
  public lineChartDataConfirmed: ChartDataSets[] = [
    { data: [], label: 'Confirmed', fill: false },
  ];
  public lineChartDataDailyConfirmed: ChartDataSets[] = [
    { data: [], label: 'Confirmed', fill: false },
  ];
  public lineChartDataRecovered: ChartDataSets[] = [
    { data: [], label: 'Recovered', fill: false },
  ];
  public lineChartDataDeath: ChartDataSets[] = [
    { data: [], label: 'Death', fill: false },
  ];
  public lineChartDataTest: ChartDataSets[] = [
    { data: [], fill: false},
  ];
  public lineChartLabels: Label[] = [];
  public lineChartLabelsTests: Label[] = [];
  public lineChartOptions: ChartOptions = {
  responsive: true,
  elements: { point: { radius: 0 } },
	scales: {
        xAxes: [{
            gridLines: {
                display:false
            }
        }],
        yAxes: [{
            gridLines: {
                display:false
            }   
        }]
	},
	tooltips: {
		mode: 'index',
		intersect: false,
	},
	hover: {
		mode: 'nearest',
		intersect: true
	},
  };
  public lineChartColorsConfirmed: Color[] = [
    {
      borderColor: '#f00',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartColorsRecovered: Color[] = [
    {
      borderColor: '#0f0',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartColorsDeath: Color[] = [
    {
      borderColor: '#808080',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = false;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  cardData:any = {};
  stateData = [
		{
			"code":"KL",
			"state": "Kerala"
		},
		{
			"code":"MH",
			"state": "Maharashtra"
		},
		{
			"code":"KA",
			"state": "Karnataka"
		},
		{
      "code":"TL",
			"state": "Telangana"
		},
		{
			"code":"GJ",
			"state": "Gujarat"
		},
		{
			"code":"UP",
			"state": "Uttar Pradesh"
		},
		{
			"code":"RJ",
			"state": "Rajasthan"
		},
		{
			"code":"DL",
			"state": "Delhi"
		},
		{
			"code":"HR",
			"state": "Haryana"
		},
		{
			"code":"PB",
			"state": "Punjab"
		},
		{
			"code":"TN",
			"state": "Tamil Nadu"
		},
		{
			"code":"LA",
			"state": "Ladakh"
		},
		{
			"code":"WB",
			"state": "West Bengal"
		},
		{
			"code":"AP",
			"state": "Andhra Pradesh"
		},
		{
			"code":"CH",
			"state": "Chandigarh"
		},
		{
			"code":"MP",
			"state": "Madhya Pradesh"
		},
		{
			"code":"JK",
			"state": "Jammu and Kashmir"
		},
		{
			"code":"UT",
			"state": "Uttarakhand"
		},
		{
			"code":"HP",
			"state": "Himachal Pradesh"
		},
		{
			"code":"BR",
			"state": "Bihar"
		},
		{
			"code":"OR",
			"state": "Odisha"
		},
		{
			"code":"PY",
			"state": "Puducherry"
		},
		{
			"code":"CT",
			"state": "Chhattisgarh"
		},
		{
			"code":"MN",
			"state": "Manipur"
		},
		{
			"code":"AN",
			"state": "Andaman and Nicobar Islands"
		},
		{
			"code":"AS",
			"state": "Assam"
		},
		{
			"code":"ML",
			"state": "Meghalaya"
		},
		{
			"code":"TR",
			"state": "Tripura"
		},
		{
			"code":"GA",
			"state": "Goa"
		},
		{
			"code":"AR",
			"state": "Arunachal Pradesh"
		},
		{
			"code":"JH",
			"state": "Jharkhand"
		},
		{
			"code":"MZ",
			"state": "Mizoram"
		},
		{
			"code":"NL",
			"state": "Nagaland"
		},
		{
			"code":"SK",
			"state": "Sikkim"
		},
		{
			"code":"DH",
			"state": "Dadra and Nagar Haveli"
		},
		{
			"code":"DD",
			"state": "Daman and Diu"
		},
		{
			"code":"LD",
			"state": "Lakshadweep"
		}
	]
  chartConfig = {
    shapes: [
      {
        type: 'zingchart.maps',
        options: {
          bbox: [67.177, 36.494, 98.403, 6.965], // get bbox from zingchart.maps.getItemInfo('world-countries','ind');
          ignore: ['IND'], // ignore India because we are rendering a more specific India map below
          panning: true, // turn of zooming. Doesn't work with bounding box
          style: {
            tooltip: {
              borderColor: '#000',
              borderWidth: '2px',
              fontSize: '18px'
            },
            controls: {
              visible: false // turn of zooming. Doesn't work with bounding box
            },
            hoverState: {
              alpha: .28
            }
          },
          zooming: false // turn of zooming. Doesn't work with bounding box
        }
      },
      {
        type: 'zingchart.maps',
        options: {
          name: 'ind',
          panning: false, // turn of zooming. Doesn't work with bounding box
          zooming: false,
          scrolling: false,
          style: {
            tooltip: {
              borderColor: '#000',
              borderWidth: '2px',
              fontSize: '16px'
            },
            borderColor: '#000',
            borderWidth: '1px',
            controls: {
              visible: false,

            },
            hoverState: {
              alpha: .28
            },
            items: {
             
            },
            label: {
              fontSize: '15px',
              visible: false
            }
          },
        }
      }
    ]
  }

  mapSource: object;
  stateDistrictData: Object;
  chartdata = [];
  chartConfigData:Array<any>;
  confirmedChatData = [];
  testDone: any;
  lastUpdated: any;
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = ['Awaiting info', 'Male', 'Female'];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(128,128,128,0.6)', 'rgba(0,0,255,0.6)', 'rgba(255,192,203)'],
    },
  ];
  previousTestDone: any;
  constructor(private dataService: DataServiceService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.dataService.getData().subscribe((data: any) => {
      let filterData = [];
      let chartData ={};
      let color = '';
      data.statewise.forEach(element => {
        if (element.confirmed !== "0") {
          filterData.push(element);
        };
       if(element.confirmed > 0){
         let divide = element.confirmed/data.statewise[1].confirmed;
         if(divide<0.1){
           divide = 0.1;
         }
         color = `rgba(255, 0, 0, ${divide})`;
       } else{
         color = "rgba(11, 214, 0, 0.6)";
       }
        this.stateData.forEach(state =>{
          if(state.state === element.state){
            chartData[state.code]={
              tooltip: {
                text: `<b>${element.state}</b> <br> Confirmed: ${element.confirmed} <br> Recovered: ${element.recovered} <br> Deaths: ${element.deaths}`,
                backgroundColor: "#fff",
              },
              backgroundColor: color,
            }
          }
        })

      });
      this.chartConfig.shapes[1].options.style.items = chartData;
      this.cardData = filterData.splice(0, 1);
      this.lastUpdated = moment(this.cardData[0].lastupdatedtime, 'DD/MM/YYYY HH:mm:ss').fromNow()
      filterData.sort((a, b) => parseFloat(b.confirmed) - parseFloat(a.confirmed));
    this.dataSource = new MatTableDataSource(filterData);
	  this.chartConfigData = data.cases_time_series;
	  let confirmedData = [];
	  let recoveredData = [];
	  let dailyTrend = [];
	  let deathData =[];
    let date = [];
    let totalTests = [];
    let confirmedTests = [];
    let testDate = [];
	  let dataLength = this.chartConfigData.length;
	  let deleteDataLength = dataLength -42;
	  this.chartConfigData.splice(0,deleteDataLength);
	  this.chartConfigData.forEach(element => {
			  confirmedData.push(Number(element.totalconfirmed));
			  recoveredData.push(Number(element.totalrecovered));
			  dailyTrend.push(Number(element.dailyconfirmed));
			  deathData.push(Number(element.totaldeceased)); 
        date.push(element.date.substring(0,6));
    });
    
    data.tested.forEach(element =>{
      totalTests.push(Number(element.totalsamplestested));
      testDate.push(element.updatetimestamp.substring(0,5));
    });
    this.lineChartDataTest[0].data = totalTests;
    this.lineChartLabelsTests = testDate;
    this.testDone = data.tested.pop();
    this.previousTestDone = data.tested.pop();
	  this.lineChartDataRecovered[0].data = recoveredData;
	  this.lineChartDataConfirmed[0].data = confirmedData;
	  this.lineChartDataDailyConfirmed[0].data = dailyTrend;
	  this.lineChartDataDeath[0].data = deathData;
    this.lineChartLabels = date;
      zingchart.loadModules('maps,maps-ind,maps-world-countries');
      zingchart.render({
        id: 'myChart',
        data: this.chartConfig,
        height: '100%',
        width: '100%',
      });

      this.isLoaded = true;
    });

    this.dataService.getStateData().subscribe(data =>{
      this.stateDistrictData = data;
    })

    this.getRawData()
    
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  openDialog(state): void {
    let data = this.stateDistrictData[state].districtData;
    let result = Object.entries(data).map(( [k, v] ) => ({ district: {district: k, data: v} }));
    let popupData = {
      data: result,
      state: state
    }
    let dialogBoxSettings = {
      height: '500px',
      width: '400px',
      margin: '0 auto',
      disableClose: false,
      hasBackdrop: true,
      data: popupData
    };
    const dialogRef = this.dialog.open(PopupComponent, dialogBoxSettings);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  getRawData(){
    this.dataService.getRawData().subscribe((data: any)=>{
      let male =0;
      let female = 0;
      let unknown = 0;
      data.raw_data.forEach(element => {
        element.gender === 'M' ? male++ : element.gender === 'F' ? female++ : unknown++;      
      });
      // let unknown = data.raw_data.length - male -female;
      this.pieChartData = [unknown, male, female];
    })
  }


}

