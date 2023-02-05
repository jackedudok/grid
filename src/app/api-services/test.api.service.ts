import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {GridInterface} from "../interfaces/grid.interface";

@Injectable({
  providedIn: 'root',
})
export class TestApiService {
  constructor(private readonly httpClient: HttpClient) {
  }

  public getItems(): Observable<GridInterface[]> {
    return this.httpClient.get<GridInterface[]>('https://test-654fa-default-rtdb.firebaseio.com/items.json' )
  }

  public updateItems(data: GridInterface[]): Observable<GridInterface[]> {
    return this.httpClient.put<GridInterface[]>('https://test-654fa-default-rtdb.firebaseio.com/items.json', data)
  }
}
