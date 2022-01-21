import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appInputformat]'
})
export class InputformatDirective {

  constructor(private el: ElementRef) { }
  @HostListener('blur') onBlur(){
    console.log(this.el.nativeElement.value);
  }


}
