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
    expressURL = 'http://localhost:3000';

    public items: Array<{ title: string; note: string; icon: string }> = [];

    constructor(private http: HttpClient) {
        this.http.get(this.expressURL + '/getImage/' + localStorage.getItem('imageURL') + 'Z').subscribe(response => {
            console.log(response);
            this.source = response.url;
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
