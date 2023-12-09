import { Injectable } from '@angular/core';
import {ThingsApiService} from "./api/things.api.service";
import {ContainersApiService} from "./api/containers.api.service";
import {Subject} from "rxjs";
import {Entity, PreparedForEntity} from "../types";

export interface Message {
  fromName: string;
  subject: string;
  date: string;
  id: number;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public dataSubject: Subject<object>= new Subject();
  public containersNamesObservable: Subject<object[]> = new Subject();
  #containersMap: any = [];

  #things: any = [];
  #containers: any = [];

  #thingsApi: ThingsApiService;
  #containerApi: ContainersApiService;

  constructor(thingsApi: ThingsApiService, containersApi: ContainersApiService) {
    this.#thingsApi = thingsApi;
    this.#containerApi = containersApi;

    this.update();
  }

  public createEntity({name, description, value, type, parent}: PreparedForEntity) {
    if (!parent) parent = 'No Parent';
    if (type === 'thing') {
      this.#thingsApi.create({name, description, value, type, parent: 'No Parent'})
        .subscribe((data:Entity) => {
          if (parent && parent !== 'No Parent') {
            this.#addToContainer(parent, data)
          } else {
            this.update();
          }
        })
    } else if (type === 'container') {
      this.#containerApi.create({name, description, value, type, parent: 'No Parent'})
        .subscribe((data) => {
          if (parent && parent !== 'No Parent') {
            this.#addToContainer(parent, data)
          } else {
            this.update();
          }
        })
    }
  }

  #addToContainer(containerId: string, entity: Entity) {
    const container = this.#containers.get(containerId);

    if (container.parent === entity.id && entity.parent === container.id) {
      alert('Not a smart Move 😁');
      return;
    }

    const summValue = [...container.insides.values()].reduce((sum: number, entity: any) => sum += Number(entity.value), 0)
    if (container.value - summValue - Number(entity.value) >= 0) {
      this.#setParent(Object.assign({}, entity, {parent: containerId}))
    } else {
      this.update();
    }
  }

  #setParent(entity: any) {
    if (entity.type === 'thing') {
      this.#thingsApi
        .update(entity.id, entity)
        .subscribe(() => {
            this.update();
        });
    } else if (entity.type === 'container') {
      this.#containerApi
        .update(entity.id, entity)
        .subscribe(() => {
            this.update();
        });
    }
  }

  public updateEntity({ name, description, value, type, parent = 'No Parent'}: PreparedForEntity, oldEntity: Pick<Entity, "id" | "parent">) {
    if (type === 'thing') {
      this.#thingsApi
        .update(oldEntity.id, {name, description, value, type, parent: 'No Parent'})
        .subscribe(() => {
          if (parent !== oldEntity.parent && parent !== 'No Parent') {
            this.#addToContainer(parent, {id: oldEntity.id, name, description, value, type, parent})
          } else {
            this.update()
          }
        });
    } else if (type === 'container') {
      this.#containerApi
        .update(oldEntity.id, {name, description, value, type, parent: 'No Parent'})
        .subscribe(() => {
          if (parent !== oldEntity.parent && parent !== 'No Parent') {
            this.#addToContainer(parent, {id: oldEntity.id, name, description, value, type, parent})
          } else {
            this.update()
          }
        });
    }
  }

  public update() {
    Promise.all([
      this.#getThings(),
      this.#getContainers()
    ])
      .then(([things, containers]: any) => {
        this.#things = things.reduce(
          (map: Map<string, object>, value: any) => {
            map.set(value.id, value);
            return map;
          },
          new Map()
        );
        this.#containers = containers.reduce(
          (map: Map<string, object>, value: any) => {
            value.capacity = value.value;
            map.set(value.id, value);
            return map;
          },
          new Map()
        );
        this.#containersMap = containers.map((item: any) => ({id: item.id, name: item.name}))
        this.containersNamesObservable.next(this.#containersMap);

        return this.#parseData({things, containers})
      })
      .then((result) => this.dataSubject.next(result))
  }

  public updateContainersMap() {
    if (this.#containersMap) {
      return this.containersNamesObservable.next(this.#containersMap)
    }

    this.#getContainers()
      .then((containers: any) => {
        this.#containersMap = containers.map((item: any) => ({id: item.id, name: item.name}));
        return this.containersNamesObservable.next(this.#containersMap)
      })
  }

  #getThings() {
    return new Promise((resolve) => {
      this.#thingsApi.getList()
        .subscribe(
          (result)=> resolve(result),
          /*
          * так как бекенда не существует, нужен этот костыль, что бы приложение работало с ходу*/
          (error: any) => {
            if (error.status === 404) setTimeout(() => window.location.reload(), 2000)
          }
        );
    })
  }

  #getContainers() {
    return new Promise((resolve) => {
      this.#containerApi.getList().subscribe(
        (result)=> resolve(result),
        /*
        * так как бекенда не существует, нужен этот костыль, что бы приложение работало с ходу*/
        (error: any) => {
          if (error.status === 404) setTimeout(() => window.location.reload(), 2000)
        }
      );
    })
  }

  #parseData({things, containers}: any) {
    const thingsMap = things.reduce(
      (map: Map<string, object>, value: any) => {
        map.set(value.id, value);
        return map;
      },
      new Map()
    );
    const containersMap = containers.reduce(
      (map: Map<string, object>, container: any) => {
        container.capacity = container.value;
        container.insides = new Set();
        map.set(container.id, container);
        return map;
      },
      new Map()
    );

    for (let thing of thingsMap.values()) {
      if (thing.parent && thing.parent !== 'No Parent') {
        const container = containersMap.get(thing.parent);
        if (!container.insides) { container.insides = new Set();}
        container.capacity -= thing.value;
        container.insides.add(thing);
        containersMap.set(thing.parent, container);
        this.#containers.set(container.id, container);
        thingsMap.delete(thing.id);
      }
    }

    const childContainers = [];

    while(containers.length) {
      const container = containers.pop();
      if (!container.insides) { container.insides = new Set(); }

      if (container.parent && container.parent !== 'No Parent') {
        childContainers.push(container)
        containersMap.delete(container.id);
      } else {
        containersMap.set(container.id, container);
      }
    }

    while (childContainers.length) {
      const container = childContainers.shift();

      const parent = containersMap.get(container.parent);

      if (parent) {
        parent.capacity -= (container.value - container.capacity)
        parent.insides.add(container);
        this.#containers.set(parent.id, parent);
      } else {
        childContainers.push(container);
      }
    }

    return {
      things: thingsMap,
      containers: containersMap,
    };
  }

  removeThing(id: string) {
    this.#thingsApi.delete(id).subscribe(() => this.update())
  }

  removeContainer(container: any) {
    const updateEntities: any = [];
    for (let inside of container.insides) {
      inside.parent = 'No Parent';
      updateEntities.push(inside);
    }

    Promise.all(
      [
        ...updateEntities.map((entity: any) => this.updateEntity(entity, {id: entity.id, parent: entity.parent})),
        this.#containerApi.delete(container.id).subscribe(() => this.update())
      ]
    )
  }
}
