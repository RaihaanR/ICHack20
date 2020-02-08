import { Component, OnInit } from '@angular/core';
import { CompileTemplateMetadata } from '@angular/compiler';

@Component({
  selector: 'app-list',
  templateUrl: 'events.page.html',
  styleUrls: ['events.page.scss']
})
export class EventsPage implements OnInit {
  private selectedItem: any;

  public items: Array<{ title: string; note: string}> = [];
  constructor() {
    for (let i = 1; i < 11; i++) {

      let current = new Date()
      let time = current.getHours().toString() + ":"
               + current.getMinutes().toString() + ":" 
               + current.getSeconds().toString()
      this.items.push({
        title: 'Event ' + i,
        note: time,
      });
    }
  }

  ngOnInit() {
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
