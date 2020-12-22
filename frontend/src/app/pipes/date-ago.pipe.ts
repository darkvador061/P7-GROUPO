import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo',
  pure: true
})
export class DateAgoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);

      // a moins de 30 secondes on affichera "À l'instant"
      if (seconds < 29) {
        return ' À l\'instant';
      } 
      
      const intervals = {
        'an': 31536000,
        'mois': 2592000,
        'semaine': 604800,
        'jour': 86400,
        'heure': 3600,
        'minute': 60,
        'seconde': 1
      };

      let counter;

      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0) {
          if (counter === 1) {
            return ' Il y a ' + counter + ' ' + i; // singulier (1 jour)
          } else {
            return ' Il y a ' + counter + ' ' + i + 's'; // pluriel (il y a 2 jours)
          }
        } 
      }
    }
    
    return value;
  }
}