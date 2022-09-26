import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], field: string, value: string): any[] {
    if (!items) {
      return [];
    }
    if (!field || !value) {
      return items;
    }

    if(this.isNumber(value)==true){
      return items.filter((singleItem) =>
      singleItem[field]==value
     )
    }else{
      return items.filter((singleItem) =>
      singleItem[field].toLowerCase().includes(value.toLowerCase())
    );
    }
   
  }
  isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

}
