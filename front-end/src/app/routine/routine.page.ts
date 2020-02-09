import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { ToastController } from '@ionic/angular';

interface Routine {
    breakfast: string;
    lunch: string;
    dinner: string;
    breakfastTime: string;
    breakfastRange: string;
    lunchTime: string;
    lunchRange: string;
    dinnerTime: string;
    dinnerRange: string;
    wake: string;
    wakeRange: string;
    wakeTime: string;
    bed: string;
    bedTime: string;
    bedRange: string;
}

@Component({
    selector: 'app-list',
    templateUrl: 'routine.page.html',
    styleUrls: ['routine.page.scss']
})

export class RoutinePage implements OnInit {
    private alertTriggers = [];

    expressURL = 'http://localhost:3000';

    public actionOptions: Array<{ title: string; note: string }> = [{
        title: 'Notification',
        note: 'notify'
    }, {title: 'Call Default Phone', note: 'call'}, {title: 'Start video call', note: 'video'}];

    public meals =
    [{
        title: 'Breakfast', note: 'breakfast', selected: false, time: '', range: ''
    },
    {
        title: 'Lunch', note: 'lunch', selected: false, time: '', range: ''
    },
    {
        title: 'Dinner', note: 'dinner', selected: false, time: '', range: ''
    }];

    public bedtimes =
    [{
        title: 'Wake Up', note: 'wake', selected: false, time: '', range: ''
    },
    {
        title: 'Bed time', note: 'bed', selected: false, time: '', range: ''
    }];

    public ranges =
    [{
        title: '15 minutes',
        note: '15'
    },
    {
        title: '30 minutes',
        note: '30'
    },
    {
        title: '1 hour',
        note: '60'
    }];

    constructor(private http: HttpClient) {
        this.http.get(this.expressURL + '/routine').subscribe(response => {
            const routine = response as Routine;
            if (routine.breakfast === 'true') {
                const meal = this.meals.find(x => x.note === 'breakfast');
                meal.selected = true;
                meal.time = routine.breakfastTime;
                meal.range = routine.breakfastRange;
            }

            if (routine.lunch === 'true') {
                const meal = this.meals.find(x => x.note === 'lunch');
                meal.selected = true;
                meal.time = routine.lunchTime;
                meal.range = routine.lunchRange;
            }

            if (routine.dinner === 'true') {
                const meal = this.meals.find(x => x.note === 'dinner');
                meal.selected = true;
                meal.time = routine.dinnerTime;
                meal.range = routine.dinnerRange;
            }

            if (routine.wake === 'true') {
                const time = this.bedtimes.find(x => x.note === 'wake');
                time.selected = true;
                time.time = routine.wakeTime;
                time.range = routine.wakeRange;
            }

            if (routine.bed === 'true') {
                const time = this.bedtimes.find(x => x.note === 'bed');
                time.selected = true;
                time.time = routine.bedTime;
                time.range = routine.bedRange;
            }
         });
    }

    ngOnInit() {
    }

    saveRoutine() {
        this.meals.forEach(x => {
            console.log(x.note);

            this.http.get(this.expressURL + '/routine/' + x.note + '/' + x.selected).subscribe(response => {
                console.log(response);
            });

            this.http.get(this.expressURL + '/routine/' + x.note + 'Time' + '/' + x.time).subscribe(response => {
                console.log(response);
            });

            this.http.get(this.expressURL + '/routine/' + x.note + 'Range' + '/' + x.range).subscribe(response => {
                console.log(response);
            });
        });

        this.bedtimes.forEach(x => {
            console.log(x.note);

            this.http.get(this.expressURL + '/routine/' + x.note + '/' + x.selected).subscribe(response => {
                console.log(response);
            });
            this.http.get(this.expressURL + '/routine/' + x.note + 'Time' + '/' + x.time).subscribe(response => {
                console.log(response);
            });

            this.http.get(this.expressURL + '/routine/' + x.note + 'Range' + '/' + x.range).subscribe(response => {
                console.log(response);
            });
        });

        this.showSaved();
    }

    async showSaved() {
        const controller = new ToastController();
        const toast = await controller.create({
          message: 'Your settings have been saved.',
          duration: 2000
        });
        toast.present();
    }

    ionViewWillLeave() {
        this.saveRoutine();
    }
}
