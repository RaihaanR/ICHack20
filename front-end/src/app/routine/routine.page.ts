import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { ToastController } from '@ionic/angular';

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
        title: 'Wake up', note: 'wake', selected: false
    },
    {
        title: 'Bed time', note: 'bed', selected: false
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
            if (response.breakfast == "true") {
                let meal = this.meals.find(x => x.note == "breakfast")
                meal.selected = true
                meal.time = response.breakfastTime
            }

            if (response.lunch == "true") {
                let meal = this.meals.find(x => x.note == "lunch")
                meal.selected = true
                meal.time = response.lunchTime
            }

            if (response.dinner == "true") {
                let meal = this.meals.find(x => x.note == "dinner")
                meal.selected = true
                meal.time = response.dinnerTime
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

            let time = document.getElementById(x.note + 'Time').value;
            
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
