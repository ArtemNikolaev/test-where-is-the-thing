import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Entity, PreparedForEntity} from "../../types";

@Injectable({
  providedIn: 'root'
})
export class ThingsApiService {
  #http: HttpClient;
  #headers = new HttpHeaders({"Access-Control-Max-Age": 0});

  constructor(http: HttpClient) {
    this.#http = http;

  }

  create(data: PreparedForEntity) : Observable<Entity>{

    return this.#http.post('api/things', data, {
      headers: this.#headers
    }) as Observable<Entity>
  }

  getList(): Observable<Entity[]>{
    return this.#http.get('api/things', {
      headers: this.#headers
    }) as Observable<Entity[]>;
  }

  getById(id: string): Observable<Entity> {
    return this.#http.get('api/things/' + id, {
      headers: this.#headers
    }) as Observable<Entity>;
  }

  update(id: string, data: PreparedForEntity) {
    return this.#http.put('api/things/' + id, data, {
      headers: this.#headers
    });
  }

  delete(id: string): Observable<object> {
    return this.#http.delete('api/things/' + id, {
      headers: this.#headers
    });
  }
}
