import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appInvalidControlTabContainer]'
})
export class InvalidControlTabContainerDirective {

  readonly containerEl: HTMLElement = this.el.nativeElement;

  constructor(private el: ElementRef) { }

}
