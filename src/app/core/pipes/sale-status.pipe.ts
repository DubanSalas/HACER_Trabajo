// src/app/core/pipes/sale-status.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'saleStatus'
})
export class SaleStatusPipe implements PipeTransform {
  transform(value: string): string {
    if (value === 'completed') {
      return 'Completada';
    } else if (value === 'pending') {
      return 'Pendiente';
    }
    return 'Desconocido';
  }
}
