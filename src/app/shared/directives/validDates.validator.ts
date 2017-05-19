// equal-validator.directive.ts

import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
@Directive({
    selector: '[validateDates][formControlName],[validateDates][formControl],[validateDates][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => validateDates), multi: true }
    ]
})
export class validateDates implements Validator {
    constructor( @Attribute('validateDates') public whichDate: string) {}

    validate(control: AbstractControl): { [key: string]: any } {      
      let otherDateControl = control.root.get(this.whichDate); // gets other formControl to compare this one to
      let thisValue = control.value;
      let otherValue = otherDateControl.value;
      let startDateTimestamp: any;
      let endDateTimestamp: any;

      if (thisValue !== "" && thisValue !== undefined) {
        if (this.whichDate.indexOf("end_date") > -1){
          // thisValue is start_date changing
          startDateTimestamp = new Date(thisValue.year, Number(thisValue.month-1), thisValue.day);
          endDateTimestamp = new Date(otherValue.year, Number(otherValue.month-1), otherValue.day);
        } else {
          // thisValue is end_date changing
          endDateTimestamp = new Date(thisValue.year, Number(thisValue.month-1), thisValue.day);
          startDateTimestamp = new Date(otherValue.year, Number(otherValue.month-1), otherValue.day);
        }
        
        if (otherValue !== undefined && otherValue !== null && otherValue !== "") {
            if (Date.parse(endDateTimestamp) < Date.parse(startDateTimestamp)){
                return { validateDates: {valid: false } }
            } else { 
              if (!control.root.get(this.whichDate).valid) control.root.get(this.whichDate).updateValueAndValidity();
            }
        }
      }      
      return null;
  }
}