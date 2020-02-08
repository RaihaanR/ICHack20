import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public items: Array<{ title: string; note: string}> = [];

  constructor() {
    for (let i = 1; i < 5; i++) {

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

}
