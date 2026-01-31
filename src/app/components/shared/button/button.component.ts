import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [type]="type"
      [class]="getButtonClass()"
      [disabled]="disabled">
      <span *ngIf="icon" class="material-icons">{{ icon }}</span>
      <ng-content></ng-content>
    </button>
  `,
  styles: []
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'outline' | 'white' = 'primary';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() icon?: string;

  getButtonClass(): string {
    const baseClass = 'btn';
    const variantClass = `btn-${this.variant}`;
    return `${baseClass} ${variantClass}`;
  }
}
