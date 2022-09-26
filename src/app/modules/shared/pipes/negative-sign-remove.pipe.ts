import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'negativeSignRemove'
})
export class NegativeSignRemovePipe implements PipeTransform {

  transform(value: number): number {
    return Math.abs(value);
  }
}
