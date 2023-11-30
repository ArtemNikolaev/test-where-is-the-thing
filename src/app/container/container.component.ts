import {Component, Input, OnChanges} from '@angular/core';
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent  implements OnChanges {
  public showEdit = false;

  @Input() data: any;
  public insides: any = [];

  constructor(private dataService: DataService) { }

  ngOnChanges() {
    this.insides = [...this.data.insides.values()];
  }

  toggleEdit() {
    this.showEdit = !this.showEdit;
  }

  removeItem() {
    this.dataService.removeContainer(this.data);
  }
}
