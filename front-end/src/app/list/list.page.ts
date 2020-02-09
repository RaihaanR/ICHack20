import {Component, OnInit} from '@angular/core';
import {NavController} from "@ionic/angular";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-list',
    templateUrl: 'list.page.html',
    styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {

    private source = '';
    expressURL = 'http://209.97.190.210:4000';

    public items: Array<{ title: string; note: string; icon: string }> = [];

    constructor(private http: HttpClient) {
        this.http.get(this.expressURL + '/getImage/' + localStorage.getItem('imageURL') + 'Z').subscribe(response => {
            console.log(response);
            setTimeout(() => {
                console.log('Async operation has ended');
                // @ts-ignore
                this.source = response.url;
            }, 2000);
        });

    }

    ngOnInit() {
        // this.source = localStorage.getItem('imageURL');
        // console.log(this.source);
    }

    // add back when alpha.4 is out
    // navigate(item) {
    //   this.router.navigate(['/list', JSON.stringify(item)]);
    // }
}
