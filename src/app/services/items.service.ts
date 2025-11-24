
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item.model';
import { API_ENDPOINTS } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private http = inject(HttpClient);

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(API_ENDPOINTS.items);
  }
}