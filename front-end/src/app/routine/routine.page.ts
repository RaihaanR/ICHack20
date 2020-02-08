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

    public meals = [{title: 'Breakfast', selected: false}, {title: 'Lunch', selected: false}, {title: 'Dinner', selected: false}];
    public bedtimes = [{title: 'Wake up', selected: false}, {title: 'Bed time', selected: false}];
    public ranges = [{range: '15 minutes'}, {range: '30 minutes'}, {range: '1 hour'}];

    constructor() {
    }

    ngOnInit() {
    }

    saveSettings() {
        console.log(this.alertTriggers);
    }
}
