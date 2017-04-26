/*import { ElementRef, HostListener, Directive} from '@angular/core';

@Directive({
    selector: 'textarea[autosize]'
})

export class Autosize {
 @HostListener('input',['$event.target'])
  onLoad(textArea: HTMLTextAreaElement): void {
    this.adjust();
  }
  constructor(public element: ElementRef){
  }
  ngAfterContentChecked(): void{
    this.adjust();
  }
  adjust(): void{
    this.element.nativeElement.style.overflow = 'hidden';
    this.element.nativeElement.style.height = 'auto';
    this.element.nativeElement.style.height = this.element.nativeElement.scrollHeight + "px";
  }
}
*/
// ./app/shared/hidden.directive.ts
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

// Directive decorator
@Directive({ selector: '[myautosize]' })
// Directive class
export class AutosizeDirective {
    constructor(public element: ElementRef) {
     // Use renderer to render the element with styles
     //  renderer.setElementStyle(el.nativeElement, 'display', 'none');
    }
    @Input() myautosize: string;

    ngOnInit(){
        this.adjust();
    }
    adjust(): void{
        let initialHeight = this.element.nativeElement.style.initialHeight;
        //this.element.nativeElement.style.height = 'auto';
        this.element.nativeElement.style.height = initialHeight;// this.element.nativeElement.style.initialHeight;
        this.element.nativeElement.style.height = "" + this.element.nativeElement.scrollHeight + "px";            
    }
}