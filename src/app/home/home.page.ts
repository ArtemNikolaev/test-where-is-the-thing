import { Component, inject } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';

import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public things: any = [];
  public containers: any = [];

  private dataService = inject(DataService);
  constructor() {
    this.dataService.dataSubject.subscribe(({things, containers}: any) => {
      this.things = [...things.values()];
      this.containers = [...containers.values()];
    });
  }

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }

}
