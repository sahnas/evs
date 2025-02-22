import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusDisplay',
  standalone: true,
})
export class StatusDisplayPipe implements PipeTransform {
  transform(status: string): string {
    const statusMap: Record<string, string> = {
      Confirmé: 'Confirmé',
      Annulé: 'Annulé',
      'Recherche de place': 'En recherche de place',
      'A organiser': 'À organiser',
    };
    return statusMap[status] || status;
  }
}
