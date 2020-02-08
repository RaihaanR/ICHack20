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

    public detections = [{title: 'Fall Detection', note: 'fall', selected: false}, {title: 'Signs of Sadness or Lonliness', note: 'sadness', selected: false}];
    phone: any;

    // public validationMessages = {
    //     phone: [
    //         { type: 'minlength', message: 'UK Phone Number must be exactly 11 digits long' },
    //         { type: 'maxlength', message: 'UK Phone Number must be exactly 11 digits long' },
    //     ]};

        constructor() {
    }

    ngOnInit() {
    }

    saveSettings() {
        console.log(this.phone)
        console.log(this.alertTriggers);
    }
}
