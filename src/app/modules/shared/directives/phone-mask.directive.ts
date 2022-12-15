import { Directive, HostListener } from '@angular/core';
import { NgControl, Validators } from '@angular/forms';

@Directive({
  selector: '[formControlName][appPhoneMask]',
})
export class PhoneMaskDirective {
  constructor(public ngControl: NgControl) {}

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event) {
    this.onInputChange(event, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(this.ngControl.control.value, true);
  }

  ngOnInit() {
    this.formatValue(this.ngControl.control.value, false);
  }

  onInputChange(event, backspace) {
    this.formatValue(event, backspace);
  }

  formatValue(event, backspace) {
    let newVal = event.replace(/\D/g, '');
    if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }
    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 3) {
      newVal = newVal.replace(/^(\d{0,3})/, '($1)');
    } else if (newVal.length <= 6) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
    }else if (newVal.length == 10) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    }
    else if (newVal.length <= 10) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    } else if (newVal.length <= 13) {
      newVal = newVal.substring(0, 13);
      newVal = newVal.replace(
        /^(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/,
        '($1) $2-$3 x$4'
      );
    } else {
      if (newVal.length >= 13) {
        newVal = newVal.substring(0, 13);
        newVal = newVal.replace(
          /^(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/,
          '($1) $2-$3 x$4'
        );
        
      } else {
        newVal = newVal.substring(0, 10);
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
      }
    }
    this.ngControl.valueAccessor.writeValue(newVal);
    if(newVal.length == 14 || newVal.length == 19)
      this.ngControl.control.setErrors(null);
    else
    this.ngControl.control.setValidators([Validators.required,Validators.pattern(/^(1\s?)?(\d{3}|\(\d{3}\))[\s\-]?\d{3}[\s\-]?\d{4}( ?x([0-9]{3}))?$/)]);
  }
}
