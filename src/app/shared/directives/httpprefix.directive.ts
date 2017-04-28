import { Directive, ElementRef } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: '[httpprefix]',
  host: {
    '(focus)': 'setInputFocus()'
  }
})
export class httpPrefix {
  public newVal: string;
  constructor(public model: NgControl, public el: ElementRef) { }
    setInputFocus(event){
    if (this.el.nativeElement.value.substring(0, 4) != "http")
        this.newVal = 'http://' + this.el.nativeElement.value;
    else this.newVal = this.el.nativeElement.value;
    
    if (this.newVal.length == 0) {
      this.newVal = '';
    } 
    this.model.valueAccessor.writeValue(this.newVal);       
  }
}
// https://github.com/text-mask/text-mask <-- look into for phone number and other masks..maybe this one too