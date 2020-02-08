import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-list',
    templateUrl: 'routine.page.html',
    styleUrls: ['routine.page.scss']
})
export class RoutinePage implements OnInit {
    private alertTriggers = [];
    detectFalls: boolean;
    public actionOptions: Array<{ title: string; note: string }> = [{
        title: 'Notification',
        note: 'notify'
    }, {title: 'Call Default Phone', note: 'call'}, {title: 'Start video call', note: 'video'}];

    public meals = [{title: 'Breakfast'}, {title: 'Lunch'}, {title: 'Dinner'}]
    public bedtimes = [{title: 'Wake up'}, {title: 'Bed time'}]

    constructor() {
    }

    ngOnInit() {
    }

    saveSettings() {
        console.log(this.alertTriggers);
    }
}
