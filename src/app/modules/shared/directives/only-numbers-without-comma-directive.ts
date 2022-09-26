import { Directive, HostListener } from '@angular/core';
import { ElementRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
@Directive({
  selector: '[appOnlyNumbersWithoutComma]'
})
export class OnlyNumbersWithoutCommaDirective {
  inputElement: HTMLElement;
  constructor(public el: ElementRef, private decimalPipe: DecimalPipe) {
    this.inputElement = el.nativeElement;
  }
  onMouseDown(event, conditionParameter) {
  
    const position = this.el.nativeElement as HTMLInputElement;

    if (typeof position.selectionStart == "number") {
      if (position.selectionStart == 0 && position.selectionEnd == position.value.length) {
        if (event.keyCode == 37 || event.keyCode == 39 || event.shiftKey) {
        }
        else if ((event.keyCode < 48 || (event.keyCode > 57 && (event.keyCode < 96 || (event.keyCode > 105 && event.keyCode != 110)))) && (event.key != "." && event.keyCode != 16) || (event.keyCode == 189 || event.keyCode == 109)) {
        }
        else if (event.shiftKey && (event.keyCode > 47 && event.keyCode < 58) && (event.keyCode != 37 || event.keyCode != 38 || event.keyCode != 39 || event.keyCode != 40)) {
        }
        else {
          position.value = '';
        }
      }
    }
    if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode >= 96 && event.keyCode <= 105 || event.keyCode == 110 || event.keyCode == 190) {
      position.value = position.value.replace(position.value.substring(position.selectionStart, position.selectionEnd), "")
      position.value= position.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'');
    }

  }
  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
  
    let conditionParameter = this.el.nativeElement.id;
    const position = this.el.nativeElement as HTMLInputElement;
    this.onMouseDown(e, conditionParameter)
    let value = e.target['value'];
    let svalue = position.selectionStart;
    value = value.replace(/[, ]+/g, "").trim();

    if (e.keyCode === 8 || e.keyCode === 46 ||
      (e.key === 'a' && e.ctrlKey === true)
      || (e.key === 'c' && e.ctrlKey === true) || (e.key === 'v' && e.ctrlKey === true) ||
      (e.key === 'x' && e.ctrlKey === true) || (e.key === 'z' && e.ctrlKey === true) || e.key === 'Tab') {
      return true;
    }
    else if (e.shiftKey && ((e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 189)) {
      return false;
    }
    else if (e.keyCode == 8 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 46) {
      return true;
    }
    else if ((e.keyCode < 48 || (e.keyCode > 57 && (e.keyCode < 96 || (e.keyCode > 105 && e.keyCode != 110)))) && (e.keyCode != 189 && e.keyCode != 109 && e.key != "." && e.keyCode != 16)) {
      return false;
    }
    else if (e.keyCode == 190 || e.keyCode == 110) {
      if (value.indexOf('.') >= 0) {
        return false;
      }
      else {
        return true;
      }
    }
    else if (e.keyCode == 189 || e.keyCode == 109) {
      if (value.indexOf('-') >= 0) {
        return false;
      }
      else if (svalue === 0) {
        return true
      }
      else if (value.length >= 1) {
        return false;
      }
      else {
        return true;
      }
    }
    else if (value.replace(/[- ]+/g, "").trim().length >= 10) {
      return false
    }
    else if (value.includes(".")) {
      if (e.keyCode == 189 || e.keyCode == 109) {
        return false
      }
      if (value.split(".")[1].length >= 2) {
        return false;
      }
    }
    else if (value.includes("-")) {
      if (e.keyCode == 189 || e.keyCode == 109) {
        return false
      }
      else {
        return true;
      }
    }
    else {
      return true;
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    
    event.preventDefault();
    let val: any = event.clipboardData
      .getData('text/plain');
    var dropValue = event.target['value'].replace(/[, ]+/g, "").trim();
    event.target['value'] = ''
    for (let i = 0; i < val.length; i++) {
      if (dropValue.length >= 10 || dropValue.length >= 15) {
        break;
      }
      let values = val[i];
      if (!isNaN(values) || values == "." || ((values == "-" && (dropValue === '-' || dropValue === '')))) {
        dropValue += values;
      }
    }
    val = dropValue.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'');
    // var input = event.target;
    // input['value'] = val;
    
 this.inputElement.focus();
       document.execCommand('insertText', false, val);
       return ;
   // document.execCommand('insertText', false, val);

    // if (val == "") {
    //   this.inputElement.focus();
    //   document.execCommand('insertText', false, '');
    //   return
    // }
    // if (val.includes(".")) {
    //   let d = this.decimalPipe.transform(val, '1.0-2')
    //   this.inputElement.focus();
    //   document.execCommand('insertText', false, val);
    // }
    // else {
    //   let d = this.decimalPipe.transform(val, '1.0')
    //   this.inputElement.focus();
    //   document.execCommand('insertText', false, val);
    // }


    //let d = this.decimalPipe.transform(val, '1.0-2')
    //this.inputElement.focus();
    //document.execCommand('insertText', false, d);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
   
    event.preventDefault();
    let val: any = event.dataTransfer.getData('text');
    var dropValue = event.target['value'].replace(/[, ]+/g, "").trim();
    event.target['value'] = ''
    for (let i = 0; i < val.length; i++) {
      if (dropValue.length >= 10 || dropValue.length >= 15) {
        break;
      }
      let values = val[i].trim();
      if (!isNaN(values) || values == "." || ((values == "-" && (dropValue === '-' || dropValue === '')))) {
        dropValue += values;
      }
    }
    val = dropValue.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'');
    if (val == "") {
      this.inputElement.focus();
      document.execCommand('insertText', false, '');
      return
    }
    if (val.includes(".")) {
      let d = this.decimalPipe.transform(val, '1.0-2')
      this.inputElement.focus();
      document.execCommand('insertText', false, val);
    }
    else {
      let d = this.decimalPipe.transform(val, '1.0')
      this.inputElement.focus();
      document.execCommand('insertText', false, val);
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyup(event: KeyboardEvent) {
    
    if (this.el.nativeElement.id != "MaxCarryOver") {
      let val = event.target['value'];
      val = val.replace(/[, ]+/g, "").trim();
      if (val.indexOf("-") > 0) {
        return
      }
      let splitValue = val.split('.');
      const position = this.el.nativeElement as HTMLInputElement;
      let decimalValue = '';
      if (val.includes(".") && typeof splitValue[1] !== 'undefined' && splitValue[1] !== '' && (splitValue[1]) !== '0' && splitValue[1] !== '00') {

        if (splitValue[1].length > 1 && splitValue[1][1] === '0') {
          decimalValue = position.value
        }
        else
          //  decimalValue = this.decimalPipe.transform(parseFloat(val).toFixed(2), '1.1-2')
          decimalValue = val
      }
      else if (val.includes(".") || val === '-') {
        decimalValue = position.value
      }
      else if (val != '') {
        decimalValue = parseFloat(val).toLocaleString('en-GB')
      }
      position.value = decimalValue.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'');
    }
  }


}
