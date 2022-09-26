import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { NgControl, NgModel } from '@angular/forms';

@Directive({
  selector: '[appTrimWhiteSpace]'
})
export class TrimWhiteSpaceDirective {
  constructor(private _el: ElementRef, private control : NgControl) { }

  @HostListener('change', ['$event']) onChanges(event: KeyboardEvent) {
    this.control.control.setValue(this._el.nativeElement.value.trim());
  }
}
