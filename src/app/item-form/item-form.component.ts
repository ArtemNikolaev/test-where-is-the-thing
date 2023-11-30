import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {DataService} from "../services/data.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Entity, EntityType, PreparedForEntity} from "../types";

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
})
export class ItemFormComponent  implements OnInit, OnChanges {
  @Output() formSubmittedEvent = new EventEmitter<void>();
  @Input() data: any = {
    name: '',
    description: '',
    value: 0,
    type: EntityType.thing,
    parent: 'No Parent'
  };
  public containersNames: any = [];
  public containersIds: string[] = [];
  public types = [EntityType.thing, EntityType.container];
  public message = '';
  public isToastOpen = false;

  #dataService: DataService;

  public form = new FormGroup({
    name: new FormControl('' as any),
    description: new FormControl('' as any),
    value: new FormControl(0 as any),
    type: new FormControl('thing'),
    parent: new FormControl('No Parent'),
  })

  constructor(data: DataService) {
    this.#dataService = data;
    this.#dataService.containersNamesObservable.subscribe((result: object[]) => {
      this.containersNames = result
        .filter(({ id}: any) => this.data.id !== id)
        .reduce((obj:any, {id, name}: any) => {
          obj[id] = name;
          return obj;
        }, {});
      this.containersIds = [
        ...result
          .filter(({ id}: any) => this.data.id !== id)
          .map((item: any) => item.id)
      ];
    })
  }

  ngOnInit() {
    this.#dataService.updateContainersMap();
    const {
      name, description, value, type, parent = ''
    } = this.data;
    this.form.setValue({
      name, description, value, type, parent
    });
  }

  ngOnChanges() {
    const {
      name, description, value, type, parent = ''
    } = this.data;
    this.form.setValue({
      name, description, value, type, parent
    });
  }

  calculate() {
    const newData = this.form.value;

    newData.value = Number(newData.value);

    if (!newData.name) {
      this.message = "Name should be valid";
      this.isToastOpen = true;
      return;
    }
    if (newData.value === null || isNaN(newData.value)) {
      this.message = "Value should be Number";
      this.isToastOpen = true;
      return;
    }
    if (!newData.type) {
      this.message = "Type should be thing or container";
      this.isToastOpen = true;
      return;
    }

    if (!this.data.id) {
      this.#dataService.createEntity(newData as PreparedForEntity);
      this.form.reset();
    } else {
      this.#dataService.updateEntity(newData as PreparedForEntity, this.data as Entity);
    }

    this.formSubmittedEvent.emit();
  }

  setOpen(value: boolean) {
    this.isToastOpen = value;
  }
}
