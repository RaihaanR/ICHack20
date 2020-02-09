import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NavController} from '@ionic/angular';
import { Url } from 'url';

interface UrlObject {
    url: string;
}

@Component({
    selector: 'app-list',
    templateUrl: 'events.page.html',
    styleUrls: ['events.page.scss']
})
export class EventsPage implements OnInit {
    private fallenItems: any;
    private mappedItems = [];
    expressURL = 'http://209.97.190.210:4000';

    public items: Array<{ title: string; note: string }> = [];

    constructor(public navCtrl: NavController, private http: HttpClient) {
        this.http.get(this.expressURL + '/fallen/get').subscribe(response => {
            // @ts-ignore
            console.log(response.data);
            // @ts-ignore
            this.fallenItems = response.data.split(',');
            this.fallenItems.pop();
            this.fallenItems.forEach(x => this.convertToDate(x));
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

    ngOnInit() {
    }

    doRefresh(event) {
        console.log('Begin async operation');
        this.http.get(this.expressURL + '/fallen/get').subscribe(response => {
            // @ts-ignore
            console.log(response.data);
            // @ts-ignore
            this.fallenItems = response.data.split(',');
            this.fallenItems.pop();
            this.fallenItems.forEach(x => this.convertToDate(x));
        });
        setTimeout(() => {
            console.log('Async operation has ended');
            event.target.complete();
        }, 2000);

    }

    openImage(initialString: string) {
        this.http.get(this.expressURL + '/getImage/' + initialString + 'Z').subscribe(response => {
            let url = (response as UrlObject).url;
            // console.log(response);
            // window.href = (response.url);
            // localStorage.setItem('imageURL', initialString);
            // @ts-ignore
            console.log(url);
            // @ts-ignore
            window.open(url.toString(), '_system');
            // @ts-ignore
            // const browser = this.iab.create(response.url.toString());
            // this.navCtrl.navigateForward(response.url);
        });
    }

}
