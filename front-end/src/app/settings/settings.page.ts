import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { EDEADLK } from 'constants';
import { ToastController } from '@ionic/angular';

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

    // public phoneNumber = {
    //     title: 'Contact Number',
    //     note: 'contactNumber',
    //     number: '012345678910'
    // };

    expressURL = 'http://localhost:3000';
    phone: any;

    constructor(private http: HttpClient) {
        this.http.get(this.expressURL + '/settings').subscribe(response => {
           console.log(response);
           if (response.detectFall == "true") {
            let detection = this.detections.find(x => x.note == "detectFall")
            detection.selected = true
            detection.action = response.detectFallAction
           }

           if (response.sadness == "true") {
            let detection = this.detections.find(x => x.note == "sadness")
            detection.selected = true
            detection.action = response.sadnessAction
           }

           document.getElementById("phone").value = response.contactNumber

        });
    }

    ngOnInit() {
    }

    saveSettings() {
        this.http.get(this.expressURL + '/set/contactNumber/' + document.getElementById("phone").value).subscribe(response => {
            console.log(response);
        }); 

        this.detections.forEach(x => {
            console.log(x.note);

            this.http.get(this.expressURL + '/set/'+ x.note +'/' + x.selected).subscribe(response => {
                console.log(response);
            }); 
            
            this.http.get(this.expressURL + '/set/'+ x.note + 'Action' +'/' + x.action).subscribe(response => {
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
