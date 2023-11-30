import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-thing',
  templateUrl: './thing.component.html',
  styleUrls: ['./thing.component.scss'],
})
export class ThingComponent  implements OnInit {
  public showEdit = false;
  @Input() data: any;
  @Output() itemValueEvent = new EventEmitter<number>();

  constructor(private dataService: DataService) {
  }

  ngOnInit() {}

  toggleEdit() {
    this.showEdit = !this.showEdit;
  }

  removeItem() {
    this.dataService.removeThing(this.data.id)
  }
}
