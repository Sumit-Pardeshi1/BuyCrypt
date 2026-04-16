export interface Favorite {
  favoriteId: string;
  userId: string;
  coinId: string;
  symbol: string;
  coinName: string;
  currentPrice: number;
  priceChange24h: number;
  addedAt: Date;
}

export interface AddFavoriteRequest {
  userId: string;
  coinId: string;
  symbol: string;
  coinName: string;
}

export interface FavoriteList {
  userId: string;
  totalFavorites: number;
  favorites: Favorite[];
  lastUpdated: Date;
}