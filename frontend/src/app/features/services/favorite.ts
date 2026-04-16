import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api';
import { Favorite, AddFavoriteRequest, FavoriteList } from '../../core/models/favorite.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  constructor(private apiService: ApiService) {}

  addFavorite(request: AddFavoriteRequest): Observable<Favorite> {
    return this.apiService.post<Favorite>('favorites', request);
  }

  getUserFavorites(userId: string): Observable<FavoriteList> {
    return this.apiService.get<FavoriteList>(`favorites/user/${userId}`);
  }

  removeFavorite(favoriteId: string): Observable<void> {
    return this.apiService.delete<void>(`favorites/${favoriteId}`);
  }
}