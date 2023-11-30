import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import {ListComponent} from "../list/list.component";
import {ThingComponent} from "../thing/thing.component";
import {ContainerComponent} from "../container/container.component";
import {ItemFormComponent} from "../item-form/item-form.component";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [HomePage, ListComponent, ThingComponent, ContainerComponent, ItemFormComponent]
})
export class HomePageModule {}
