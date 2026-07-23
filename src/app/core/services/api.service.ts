import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ad, AdStats, OverviewResponse } from '../../models/ad.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URL du backend (Node.js)
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les publicités
   */
  getAds(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ads`);
  }

  /**
   * Récupère les statistiques d'une publicité spécifique
   * @param id - ID de la publicité
   */
  getAdStats(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/ads/${id}/stats`);
  }

  /**
   * Récupère la vue d'ensemble (overview) avec les statistiques globales
   * et les performances de chaque publicité
   */
  getOverview(): Observable<OverviewResponse> {
    return this.http.get<OverviewResponse>(`${this.apiUrl}/analytics/overview`);
  }

  /**
   * Récupère les statistiques par région
   */
  getByLocation(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics/by-location`);
  }

  /**
   * Ajoute une vue à une publicité
   * @param id - ID de la publicité
   */
  addView(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/ads/${id}/view`, {});
  }

  /**
   * Ajoute un clic à une publicité
   * @param id - ID de la publicité
   */
  addClick(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/ads/${id}/click`, {});
  }
}