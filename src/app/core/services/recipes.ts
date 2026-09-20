import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PotionsResponse } from '../models/potionsModel';

@Injectable({
  providedIn: 'root'
})
export class Potions {
  constructor(private http: HttpClient) {}

  getAllPotions() {
    return this.http.get<PotionsResponse>('https://api.potterdb.com/v1/potions');
  }
}
