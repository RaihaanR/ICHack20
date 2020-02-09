import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { ToastController } from '@ionic/angular';

interface Routine {
    breakfast: string,
    lunch: string,
    dinner: string,
    breakfastTime: string,
    lunchTime: string,
    dinnerTime: string,
    wake:string,
    wakeTime: string,
    bed: string,
    bedTime: string
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
        title: 'Breakfast', note: 'breakfast', selected: false, time: ""
    }, 
    {
        title: 'Lunch', note: 'lunch', selected: false, time: ""
    },
    {
        title: 'Dinner', note: 'dinner', selected: false, time: ""
    }];

    public bedtimes = 
    [{
        title: 'Wake Up', note: 'wake', selected: false, time: ""
    },
    {
        title: 'Bed time', note: 'bed', selected: false, time: ""
    }];

    public ranges = 
    [{
        range: '15 minutes'
    },
    {
        range: '30 minutes'
    },
    {
        range: '1 hour'
    }];

    constructor(private http: HttpClient) {
        this.http.get(this.expressURL + '/routine').subscribe(response => {
            let routine = <Routine>response;
            if (routine.breakfast == "true") {
                let meal = this.meals.find(x => x.note == "breakfast")
                meal.selected = true
                meal.time = routine.breakfastTime
            }

            if (routine.lunch == "true") {
                let meal = this.meals.find(x => x.note == "lunch")
                meal.selected = true
                meal.time = routine.lunchTime
            }

            if (routine.dinner == "true") {
                let meal = this.meals.find(x => x.note == "dinner")
                meal.selected = true
                meal.time = routine.dinnerTime
            }

            if (routine.wake == "true") {
                let time = this.bedtimes.find(x => x.note == "wake")
                time.selected = true
                time.time = routine.wakeTime
            }

            if (routine.bed == "true") {
                let time = this.bedtimes.find(x => x.note == "bed")
                time.selected = true
                time.time = routine.bedTime
            }
 
         });
    }

    ngOnInit() {
    }

    saveSettings() {
        this.meals.forEach(x => {
            console.log(x.note);

            this.http.get(this.expressURL + '/routine/'+ x.note +'/' + x.selected).subscribe(response => {
                console.log(response);
            }); 

            let time = (<HTMLInputElement>document.getElementById(x.note + 'Time')).value;
            
            this.http.get(this.expressURL + '/routine/'+ x.note + 'Time' +'/' + time).subscribe(response => {
                console.log(response);
            }); 
        })

        this.bedtimes.forEach(x => {
            console.log(x.note);

            this.http.get(this.expressURL + '/routine/'+ x.note +'/' + x.selected).subscribe(response => {
                console.log(response);
            }); 

            let time = (<HTMLInputElement>document.getElementById(x.note + 'Time')).value;
            
            this.http.get(this.expressURL + '/routine/'+ x.note + 'Time' +'/' + time).subscribe(response => {
                console.log(response);
            }); 
        })

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
        this.saveSettings();
    }
}
