import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-list',
    templateUrl: 'settings.page.html',
    styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {
    private alertTriggers = [];
    detectFalls: boolean;
    public actionOptions: Array<{ title: string; note: string }> = [{
        title: 'Notification',
        note: 'notify'
    }, {title: 'Call Default Phone', note: 'call'}, {title: 'Start video call', note: 'video'}];

    public detections = [{title: 'Fall Detection', note: 'fall', selected: false}, {title: 'Signs of Sadness', note: 'sadness', selected: false}];

    constructor() {
    }

    ngOnInit() {
    }

    saveSettings() {
        console.log(this.alertTriggers);
    }
}
