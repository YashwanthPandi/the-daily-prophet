import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { Potion, PotionResource, PotionResponse, PotionsResponse } from '../models/potionsModel';

@Injectable({
  providedIn: 'root'
})
export class Potions {
  private readonly baseUrl = 'https://api.potterdb.com/v1/potions';

  constructor(private http: HttpClient) {}

  /**
   * Every potion, across all pages. The API returns at most 100 per request,
   * and there are ~170, so:
   *   1. fetch page 1, which also says how many pages there are (`last`)
   *   2. `switchMap` = "when that arrives, start these next requests":
   *      fetch pages 2..last in parallel with forkJoin
   *   3. glue all the pages together and flatten each potion
   */
  getAllPotions(): Observable<Potion[]> {
    return this.getPage(1).pipe(
      switchMap((first) => {
        const last = first.meta.pagination.last ?? 1;
        const rest = Array.from({ length: last - 1 }, (_, i) => this.getPage(i + 2));
        // forkJoin([]) would never emit, so use of([]) when there's one page
        return (rest.length ? forkJoin(rest) : of([])).pipe(
          map((pages) => [first, ...pages].flatMap((page) => page.data.map(toPotion))),
        );
      }),
    );
  }

  getPotionById(id: string | number): Observable<Potion> {
    // The single-potion endpoint returns `data` as an OBJECT, not an array.
    return this.http.get<PotionResponse>(`${this.baseUrl}/${id}`).pipe(map((res) => toPotion(res.data)));
  }

  private getPage(page: number): Observable<PotionsResponse> {
    // HttpParams-style object; Angular URL-encodes the [brackets] for us.
    return this.http.get<PotionsResponse>(this.baseUrl, {
      params: { 'page[size]': 100, 'page[number]': page },
    });
  }
}

/** { id, attributes: {...} } → { id, ...attributes } */
function toPotion(resource: PotionResource): Potion {
  return { ...resource.attributes, id: resource.id };
}
