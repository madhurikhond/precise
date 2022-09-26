import { Directive, ElementRef, HostListener, Optional } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

declare const $: any;

@Directive({
  selector: '[appInvalidTabHighlight]'
})
export class InvalidTabHighlightDirective {

  constructor(
    private el: ElementRef,

  ) { }



  @HostListener("click") onSubmit() {
    this.scrollToFirstInvalidControl()
  }

  @HostListener('keydown', ['$event']) onKeyDown(e) {
    this.scrollToFirstInvalidControl()
  }
  private scrollToFirstInvalidControl() {
    setTimeout(() => {
      $('body').find(".tab-pane").each(function (i) {
        $("[href='#" + $('body').find(".tab-pane:eq(" + i + ")").attr("id") + "']").removeClass("inValidTab")
      })
      $('body').find('.is-invalid').each(function (x) {
        $('body').find(".is-invalid:eq(" + x + ")").parents(".tab-pane").each(function (i) {
          $("[href='#" + $('body').find(".is-invalid:eq(" + x + ")").parents(".tab-pane:eq(" + i + ")").attr("id") + "']").addClass("inValidTab")
        })
      })
    }, 100);
  }

}
