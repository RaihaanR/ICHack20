import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { ToastController } from '@ionic/angular';

interface Settings {
    detectFall: string;
    sadness: string;
    sadnessAction: string;
    detectFallAction: string;
    contactNumber: string;
}

@Component({
    selector: 'app-list',
    templateUrl: 'settings.page.html',
    styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {

    public actionOptions: Array<{ title: string; note: string }> = [{
        title: 'Notification',
        note: 'notify'
    },
    {
        title: 'Call Default Phone',
        note: 'call'
    },
    {
        title: 'Start video call',
        note: 'video'
    }];

    public detections = [{
        title: 'Fall Detection',
        note: 'detectFall',
        selected: false,
        action: ''
    },
    {
        title: 'Signs of Sadness or Loneliness',
        note: 'sadness',
        selected: false,
        action: ''}];

    expressURL = 'http://localhost:3000';
    phone: any;

    constructor(private http: HttpClient) {
        this.http.get(this.expressURL + '/settings').subscribe(response => {
           const settings = response as Settings;
           if (settings.detectFall === 'true') {
            const detection = this.detections.find(x => x.note === 'detectFall');
            detection.selected = true;
            detection.action = settings.detectFallAction;
           }

           if (settings.sadness === 'true') {
            const detection = this.detections.find(x => x.note === 'sadness');
            detection.selected = true;
            detection.action = settings.sadnessAction;
           }

           (document.getElementById('phone') as HTMLInputElement).value = settings.contactNumber;

        });
    }

    ngOnInit() {
    }

    saveSettings() {
        this.http.get(this.expressURL + '/set/contactNumber/' + (document.getElementById('phone')as HTMLInputElement
        ).value).subscribe(response => {
            console.log(response);
        });

        this.detections.forEach(x => {
            console.log(x.note);

            this.http.get(this.expressURL + '/set/' + x.note + '/' + x.selected).subscribe(response => {
                console.log(response);
            });
            this.http.get(this.expressURL + '/set/' + x.note + 'Action' + '/' + x.action).subscribe(response => {
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
        this.saveSettings();
    }
}
