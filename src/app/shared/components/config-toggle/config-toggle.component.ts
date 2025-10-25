import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfigService } from '../../../core/services/config.service';

@Component({
  selector: 'app-config-toggle',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <div class="config-toggle">
      <mat-slide-toggle 
        [checked]="useMockData"
        (change)="onToggleChange($event)"
        matTooltip="Alternar entre datos del backend y datos mock">
        <mat-icon>{{ useMockData ? 'cloud_off' : 'cloud' }}</mat-icon>
        {{ useMockData ? 'Datos Mock' : 'Backend' }}
      </mat-slide-toggle>
    </div>
  `,
  styles: [`
    .config-toggle {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      margin: 8px;
    }

    mat-slide-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
    }

    mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  `]
})
export class ConfigToggleComponent {
  useMockData = true;

  constructor(private configService: ConfigService) {
    this.configService.useMockData$.subscribe(useMock => {
      this.useMockData = useMock;
    });
  }

  onToggleChange(event: any): void {
    this.configService.setUseMockData(event.checked);
    // Recargar la página para aplicar los cambios
    window.location.reload();
  }
}