import { Component } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Url } from 'url';

interface UrlObject {
  url: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  public items: Array<{ title: string; note: string}> = [];
  expressURL = 'http://209.97.190.210:4000';
  public snapshot = "data:image/jpeg;base64,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";
  private fallenItems: any;
  private mappedItems = [];
  public people = "There are 0 people in the house";

  constructor(private http: HttpClient) {

    this.http.get(this.expressURL + '/fallen/get').subscribe(response => {
      // @ts-ignore
      console.log(response.data);
      // @ts-ignore
      this.fallenItems = response.data.split(',').slice(0,5);
      this.fallenItems.pop();
      this.fallenItems.forEach(x => this.convertToDate(x));
    });

    this.http.get(this.expressURL + '/numPeople').subscribe(response => {
      console.log("people: " + response);
      let numPeople = response as string
      if (numPeople == "1") {
        this.people = "There is 1 person in the house";
      } else {
        this.people = "There are " + numPeople + " people in the house";
      }
    });
    
  }

  convertToDate(timeString) {
    const yearString = timeString.substring(0, 4);
    const dateString = timeString.substring(4, 6);
    const monthString = timeString.substring(6, 8);
    const hourString = timeString.substring(9, 11);
    const minuteString = timeString.substring(11, 13);
    const secondString = timeString.substring(13, 15);
    console.log(hourString + ':' + minuteString + ':' + secondString + ' ' + dateString + '-' + monthString + '-' + yearString);
    this.mappedItems.push({
        initialString: timeString,
        dateString: hourString + ':' + minuteString + ':' + secondString + ' ' + dateString + '-' + monthString + '-' + yearString
    });
  }

  openImage(initialString: string) {
    this.http.get(this.expressURL + '/getImage/' + initialString + 'Z').subscribe(response => {
      let url = (response as UrlObject).url;
        console.log(url);
        window.open(url.toString(), '_system');
  });
}
  

}
