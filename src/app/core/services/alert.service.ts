import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'end',
    verticalPosition: 'top'
  };

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration: number = 5000): void {
    this.snackBar.open(message, '✓', {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-success']
    });
  }

  error(message: string, duration: number = 7000): void {
    this.snackBar.open(message, '✕', {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-error']
    });
  }

  warning(message: string, duration: number = 6000): void {
    this.snackBar.open(message, '⚠', {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-warning']
    });
  }

  info(message: string, duration: number = 5000): void {
    this.snackBar.open(message, 'ℹ', {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-info']
    });
  }

  // Método para errores de validación con detalles
  validationError(errors: { [key: string]: string }): void {
    const errorMessages = Object.entries(errors)
      .map(([field, message]) => `${field}: ${message}`)
      .join('\n');
    
    this.error(`Errores de validación:\n${errorMessages}`, 10000);
  }

  // Método para mostrar error HTTP con código
  httpError(status: number, message: string): void {
    const errorMessage = `Error ${status}: ${message}`;
    this.error(errorMessage, 7000);
  }

  // Método para confirmación (usando snackbar con acción)
  confirm(message: string, action: string = 'Confirmar'): Promise<boolean> {
    return new Promise((resolve) => {
      const snackBarRef = this.snackBar.open(message, action, {
        ...this.defaultConfig,
        duration: 10000,
        panelClass: ['snackbar-confirm']
      });

      snackBarRef.onAction().subscribe(() => resolve(true));
      snackBarRef.afterDismissed().subscribe(() => resolve(false));
    });
  }
}
