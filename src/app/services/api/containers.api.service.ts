import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Entity} from "../../types";

@Injectable({
  providedIn: 'root'
})
export class ContainersApiService {
  #http: HttpClient;

  constructor(http: HttpClient) {
    this.#http = http;
  }

  create(data: any) : Observable<Entity>{
    return this.#http.post('api/containers', data) as Observable<Entity>
  }

  getList(): Observable<Entity[]>{
    return this.#http.get('api/containers') as Observable<Entity[]>;
  }

  getById(id: string): Observable<Entity> {
    return this.#http.get('api/containers/' + id) as Observable<Entity>;
  }

  update(id: string, data: any) {
    return this.#http.put('api/containers/' + id, data);
  }

  delete(id: string): Observable<object> {
    return this.#http.delete('api/containers/' + id);
  }
}
