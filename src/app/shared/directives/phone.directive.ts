import { Directive } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
    selector: '[phoneformat]', 
    host: {
    '(ngModelChange)': 'onInputChange($event)',
    '(keydown.backspace)': 'onInputChange($event.target.value, true)'
  }
})

export class phoneFormat {
    public newVal: any;

    constructor(public model: NgControl) {}

    onInputChange(event, backspace) {
        // remove all mask characters (keep only numeric)
        if (event != null) {
            this.newVal = event.replace(/\D/g, '');
            // special handling of backspace necessary otherwise deleting of non-numeric characters is not recognized            
            if (backspace) {
                this.newVal = this.newVal.substring(0, this.newVal.length - 1);
            } 

            // don't show braces for empty value
            if (this.newVal.length == 0) {
                this.newVal = '';
            } 
            // don't show braces for empty groups at the end
            else if (this.newVal.length <= 3) {
                this.newVal = this.newVal.replace(/^(\d{0,3})/, '($1)');
            } else if (this.newVal.length <= 6) {
                this.newVal = this.newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
            } else if (this.newVal.length <= 10) {
                this.newVal = this.newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
            } else if (this.newVal.length <= 15) {
                this.newVal = this.newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,5})/, '($1) $2-$3 x$4');    
            } else if (this.newVal.length > 15){
                this.newVal = this.newVal.substring(0, 15);
                this.newVal = this.newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,5})/, '($1) $2-$3 x$4');
            }

            // set the new value
            this.model.valueAccessor.writeValue(this.newVal);       
        }
    }
}