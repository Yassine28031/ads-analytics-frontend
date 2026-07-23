import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ad-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ad-detail.component.html',
  styleUrls: ['./ad-detail.component.css']
})
export class AdDetailComponent implements OnInit, OnDestroy {
  adId: string = '';
  adData: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef  // 👈 AJOUTÉ
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.adId = id;
        this.loadAdStats();
      } else {
        this.errorMessage = 'ID de publicité manquant';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  loadAdStats(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.adData = null;
    this.cdr.detectChanges();

    console.log('🔄 Chargement des détails pour l\'ID :', this.adId);

    this.apiService.getAdStats(this.adId).subscribe({
      next: (response: any) => {
        console.log('📊 Détails de la publicité reçus :', response);
        if (response && response.success && response.data) {
          this.adData = response.data;
          console.log('✅ adData mis à jour :', this.adData);
          this.isLoading = false;
          this.cdr.detectChanges(); // 👈 FORCER LA MISE À JOUR
        } else {
          this.errorMessage = 'Erreur lors du chargement des détails';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('❌ Erreur API :', err);
        this.errorMessage = 'Impossible de charger les détails. Vérifiez le backend.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  formatNumber(num: number): string {
    if (!num) return '0';
    return num.toLocaleString('fr-FR');
  }

  getDailyCTR(views: number, clicks: number): string {
    if (views === 0) return '0%';
    return ((clicks / views) * 100).toFixed(2) + '%';
  }

  getDailyCTRColor(views: number, clicks: number): string {
    if (views === 0) return 'low';
    const ctr = (clicks / views) * 100;
    if (ctr >= 30) return 'high';
    if (ctr >= 20) return 'medium';
    return 'low';
  }
}