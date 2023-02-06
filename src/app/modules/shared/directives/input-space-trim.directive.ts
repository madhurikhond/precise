import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { NgControl, NgModel } from '@angular/forms';
@Directive({
  selector: '[appInputSpaceTrim]'
})
export class InputSpaceTrimDirective {
  constructor(private el: ElementRef) { }
  @HostListener('blur') onBlur() {
    const value = this.el.nativeElement.value;
    const valueTrim = value.trim();
    if (value !== valueTrim) {
      this.el.nativeElement.value = valueTrim;
    }
  }
}