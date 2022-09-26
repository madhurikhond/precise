import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumberFormate'
})
export class PhoneNumberFormatePipe implements PipeTransform {

  transform(value: string): string {
    
     if(value)
     {
      let phoneNumber=value.match(/(\d{3})(\d{3})(\d{4})/);
      return phoneNumber[1]+'-'+phoneNumber[2]+'-'+phoneNumber[3];
     }
     return '';
  }

}
