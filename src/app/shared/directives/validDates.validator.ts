// equal-validator.directive.ts

import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS, FormArray } from '@angular/forms';
@Directive({
    selector: '[validateDates][formControlName],[validateDates][formControl],[validateDates][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => validateDates), multi: true }
    ]
})
export class validateDates implements Validator {
    constructor( @Attribute('validateDates') public whichDate: string) {}
    // TODO ::: Fix coming in here if setting one date while other date is undefined. need to check value of both before setting start and enddatetimestamps
    
    validate(control: AbstractControl): { [key: string]: any } {
      let controlRoot = <FormArray>control.root; //control.root.get(this.whichDate);

      let otherDateControl = controlRoot.controls["projectGrp"].get(this.whichDate); // gets other formControl to compare this one to
      let thisValue = control.value;
      let otherValue = otherDateControl.value;
      let startDateTimestamp: any;
      let endDateTimestamp: any;

      if (thisValue !== null && thisValue !== "" && thisValue !== undefined && otherValue !== null && otherValue !== "" && otherValue !== undefined) {
        if (this.whichDate.indexOf("end_date") > -1){
          // thisValue is start_date changing
          startDateTimestamp = new Date(thisValue.year, Number(thisValue.month-1), thisValue.day);
          endDateTimestamp = new Date(otherValue.year, Number(otherValue.month-1), otherValue.day);
        } else {
          // thisValue is end_date changing
          endDateTimestamp = new Date(thisValue.year, Number(thisValue.month-1), thisValue.day);
          startDateTimestamp = new Date(otherValue.year, Number(otherValue.month-1), otherValue.day);
        }
        
        // compare dates
        if (otherValue !== undefined && otherValue !== null && otherValue !== "") {
            if (Date.parse(endDateTimestamp) < Date.parse(startDateTimestamp)){
                return { validateDates: {valid: false } }
            } else { 
              if (!otherDateControl.valid) otherDateControl.updateValueAndValidity();
            }
        }
      }
      return null;
  }
}