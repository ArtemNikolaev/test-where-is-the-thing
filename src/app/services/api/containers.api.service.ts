import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Entity} from "../../types";

@Injectable({
  providedIn: 'root'
})
export class ContainersApiService {
  #http: HttpClient;
  #headers = new HttpHeaders({"Access-Control-Max-Age": 0});

  constructor(http: HttpClient) {
    this.#http = http;
  }

  create(data: any) : Observable<Entity>{
    return this.#http.post('api/containers', data, {
      headers: this.#headers
    }) as Observable<Entity>
  }

  getList(): Observable<Entity[]>{
    return this.#http.get('api/containers', {
      headers: this.#headers
    }) as Observable<Entity[]>;
  }

  getById(id: string): Observable<Entity> {
    return this.#http.get('api/containers/' + id, {
      headers: this.#headers
    }) as Observable<Entity>;
  }

  update(id: string, data: any) {
    return this.#http.put('api/containers/' + id, data, {
      headers: this.#headers
    });
  }

  delete(id: string): Observable<object> {
    return this.#http.delete('api/containers/' + id, {
      headers: this.#headers
    });
  }
}
