import { Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';
import { FormControlName } from '@angular/forms';

@Directive({
  selector: '[appInputSpaceTrim],[ngModel],([formControlName], [formControl]),input[type]="text"'
})
export class InputSpaceTrimDirective {
  @Output() ngModelChange = new EventEmitter();
  constructor(private el: ElementRef ,private controlName :FormControlName) { }
  @HostListener('blur') onBlur() {
    this.trimValue();
  }
  @HostListener('keydown', ['$event']) onKeyDown(e) {
    if (e.code === 'Enter')  {
      this.trimValue()
    }
    
  }
  private trimValue(){
    const value = this.el.nativeElement.value;
    if(value){
      var valueTrim = value.trim();
      this.el.nativeElement.value = valueTrim;
      this.ngModelChange.emit(this.el.nativeElement.value);
      if(this.controlName.control){
        this.controlName.control.setValue(this.el.nativeElement.value);
      }
    }else{
      this.el.nativeElement.value = null;
      if(this.controlName.control){
        this.controlName.control.setValue(null);
      }
    }  
  }
}
