import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="statusClass">
      <ng-content></ng-content>
      {{ text }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: 0.35em 0.65em;
      font-size: 0.75em;
      font-weight: 700;
      line-height: 1;
      text-align: center;
      white-space: nowrap;
      vertical-align: baseline;
      border-radius: 0.25rem;
      background-color: #e9ecef;
      color: #495057;
    }
    .badge-success { background-color: #d4edda; color: #155724; }
    .badge-warning { background-color: #fff3cd; color: #856404; }
    .badge-danger { background-color: #f8d7da; color: #721c24; }
  `]
})
export class BadgeComponent {
  @Input() text: string = '';
  @Input() status: string = '';

  get statusClass(): string {
    switch (this.status?.toUpperCase()) {
      case 'ACCEPTED': return 'badge-success';
      case 'PENDING': return 'badge-warning';
      case 'REJECTED': return 'badge-danger';
      default: return '';
    }
  }
}
