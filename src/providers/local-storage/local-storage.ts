import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the LocalStorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalStorageProvider {

  constructor(public http: HttpClient) {
    console.log('Hello LocalStorageProvider Provider');
  }


  set(key,value){
    localStorage.setItem(key,JSON.stringify(value));
  }

  get(key){
    return JSON.parse(localStorage.getItem(key));
  }

  remove(key){
    localStorage.removeItem(key);
  }
}
