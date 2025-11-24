import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Item } from '../../models/item.model';
import { ItemsService } from '../../services/items.service';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

type ListStatus = 'loading' | 'loaded' | 'error';

@Component({
  selector: 'app-list',
  imports: [
    CommonModule, 
    RouterLink,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  private itemsService = inject(ItemsService);
  private destroyRef = inject(DestroyRef);

  items = signal<Item[]>([]);
  status = signal<ListStatus>('loading');
  error = signal<string | null>(null);

  constructor() {
    this.loadItems();
  }

  loadItems(): void {
    this.status.set('loading');
    this.error.set(null);

    this.itemsService.getItems()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.items.set(data);
          this.status.set('loaded');
        },
        error: (err) => {
          console.error(err);
          this.error.set('Failed to load items. Please try again later.');
          this.status.set('error');
        }
      });
  }
}