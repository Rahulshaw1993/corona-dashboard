import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor(private _http: HttpClient) { }

  getData(){
    return this._http.get('https://api.covid19india.org/data.json')
  };

  getStateData(){
    return this._http.get('https://api.covid19india.org/state_district_wise.json')
  }
  getRawData(){
    return this._http.get('https://api.covid19india.org/raw_data.json')
  }

  getWorldData(){
    return this._http.get('https://corona.lmao.ninja/v2/all');
  }
  getWorldCountryData(){
    // return this._http.get('https://api.coronatracker.com/v3/stats/worldometer/topCountry')
    return this._http.get('https://corona.lmao.ninja/v2/countries')
  }
  getYesterdayCountryData(){
    // return this._http.get('https://api.coronatracker.com/v3/stats/worldometer/topCountry')
    return this._http.get('https://corona.lmao.ninja/v2/yesterday')
  }

}
