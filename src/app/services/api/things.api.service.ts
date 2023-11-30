import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Entity, PreparedForEntity} from "../../types";

@Injectable({
  providedIn: 'root'
})
export class ThingsApiService {
  #http: HttpClient;

  constructor(http: HttpClient) {
    this.#http = http;
  }

  create(data: PreparedForEntity) : Observable<Entity>{

    return this.#http.post('api/things', data) as Observable<Entity>
  }

  getList(): Observable<Entity[]>{
    return this.#http.get('api/things') as Observable<Entity[]>;
  }

  getById(id: string): Observable<Entity> {
    return this.#http.get('api/things/' + id) as Observable<Entity>;
  }

  update(id: string, data: PreparedForEntity) {
    return this.#http.put('api/things/' + id, data);
  }

  delete(id: string): Observable<object> {
    return this.#http.delete('api/things/' + id);
  }
}
