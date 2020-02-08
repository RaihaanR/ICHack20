import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-list',
    templateUrl: 'settings.page.html',
    styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {

    public actionOptions: Array<{ title: string; note: string }> = [{
        title: 'Notification',
        note: 'notify'
    }, {title: 'Call Default Phone', note: 'call'}, {title: 'Start video call', note: 'video'}];

    public detections = [{
        title: 'Fall Detection',
        note: 'fall',
        selected: false,
        action: ''
    }, {title: 'Signs of Sadness or Loneliness', note: 'sadness', selected: false, action: ''}];

    expressURL = 'http://localhost:3000';
    phone: any;

    constructor(private http: HttpClient) {
        this.http.get(this.expressURL + '/settings').subscribe(response => {
           console.log(response);
           this.detections.find(x -> x.note == "")
        });
    }

    ngOnInit() {
    }

    saveSettings() {
        console.log(this.phone);
    }
}
