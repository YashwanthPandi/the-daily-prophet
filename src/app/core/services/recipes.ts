import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Potions {
  constructor(private http: HttpClient) {}

  getAllPotions() {
    return this.http.get('https://api.potterdb.com/v1/potions');
  }
}