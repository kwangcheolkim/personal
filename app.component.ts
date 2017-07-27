import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

declare var _spPageContextInfo: any;

interface CustomerItem {
  Id: number;
  Title: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private spApiUrl: string;
  private customers: CustomerItem[];

  constructor(private http: Http) {
    this.spApiUrl = _spPageContextInfo.webServerRelativeUrl;
  }

  title = 'app works';
  url = 'http://api.openweathermap.org/data/2.5/weather?appid=e0bcd1131039e30ebb5bc91cb676d985&q=london';

  cityName = '';
  cityHumid = '';

  ngOnInit() {
    this.GetData();
  }
  searchCity() {


    this.http.get(this.url)
      .subscribe(
      (res: Response) => {
        const weatherCity = res.json();
        console.log(weatherCity);
      }
      );

  }

  GetData() {

    this.spApiUrl = _spPageContextInfo.webServerRelativeUrl;

    const url = this.spApiUrl + '/_api/lists/getbytitle(\'Customers\')/items?$select=Title,Id';

    this.http.get(url, { headers: this.setHeaders() })
      .map(response => response.json().d.results as CustomerItem[])
      .subscribe(
      items => this.customers = items,
      err => console.log(err),
      () => console.log('completed')
      );
  }

  // SET HEADERS
  private setHeaders(verb?: string) {
    const headers = new Headers();

    const digest = document.getElementById('__REQUESTDIGEST').innerText;
    headers.set('Accept', 'application/json;odata=verbose');
    headers.set('X-RequestDigest', digest);

    switch (verb) {

      case 'POST':
        headers.set('Content-type', 'application/json;odata=verbose');
        break;
      case 'PUT':
        headers.set('Content-type', 'application/json;odata=verbose');
        headers.set('IF-MATCH', '*');
        headers.set('X-HTTP-Method', 'MERGE');
        break;
      case 'DELETE':
        headers.set('IF-MATCH', '*');
        headers.set('X-HTTP-Method', 'DELETE');
        break;
    }
    return headers;
  }


}
