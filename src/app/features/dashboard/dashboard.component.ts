import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { OverviewResponse, AdPerformance } from '../../models/ad.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // ==================== DONNÉES ====================
  overviewData: OverviewResponse['data'] | null = null;
  ads: AdPerformance[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  // ==================== FILTRES ====================
  searchTerm: string = '';
  filterActive: string = 'all';
  filterPaid: string = 'all';

  // ==================== CONSTRUCTEUR ====================
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef   // 👈 AJOUTÉ
  ) {}

  // ==================== INITIALISATION ====================
  ngOnInit(): void {
    this.loadData();
  }

  // ==================== CHARGEMENT DES DONNÉES ====================
  loadData(): void {
    console.log('🔄 Début du chargement...');
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();  // Force la mise à jour du template

    this.apiService.getOverview().subscribe({
      next: (response: OverviewResponse) => {
        console.log('📊 Données reçues :', response);
        
        if (response && response.success && response.data) {
          this.overviewData = response.data;
          this.ads = response.data.adPerformance || [];
          console.log('✅ overviewData :', this.overviewData);
          console.log('✅ ads :', this.ads);
          
          this.isLoading = false;
          console.log('✅ isLoading = false');
          
          // 👉 Forcer la mise à jour du template
          this.cdr.detectChanges();
          
        } else {
          this.errorMessage = 'Format de données invalide';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('❌ Erreur API :', err);
        this.errorMessage = 'Impossible de charger les données. Vérifiez que le backend est lancé.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ==================== FILTRAGE DES PUBLICITÉS ====================
  getFilteredAds(): AdPerformance[] {
    let filtered = this.ads;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(ad =>
        ad.adName.toLowerCase().includes(term) ||
        ad.adTitle.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  // ==================== ACTIONS ====================
  addView(adId: string, event: Event): void {
    event.stopPropagation();
    this.apiService.addView(adId).subscribe({
      next: () => {
        alert('✅ Vue ajoutée !');
        this.loadData();
      },
      error: (err) => {
        console.error('Erreur :', err);
        alert('❌ Erreur lors de l\'ajout de la vue');
      }
    });
  }

  addClick(adId: string, event: Event): void {
    event.stopPropagation();
    this.apiService.addClick(adId).subscribe({
      next: () => {
        alert('✅ Clic ajouté !');
        this.loadData();
      },
      error: (err) => {
        console.error('Erreur :', err);
        alert('❌ Erreur lors de l\'ajout du clic');
      }
    });
  }

  viewAdDetails(adId: string): void {
    this.router.navigate(['/ad', adId]);
  }

  refreshData(): void {
    this.loadData();
  }

  logout(): void {
    this.authService.logout();
  }

  formatNumber(num: number): string {
    if (!num) return '0';
    return num.toLocaleString('fr-FR');
  }

  getCTRColor(ctr: string): string {
    const value = parseFloat(ctr);
    if (isNaN(value)) return 'low';
    if (value >= 30) return 'high';
    if (value >= 20) return 'medium';
    return 'low';
  }
}