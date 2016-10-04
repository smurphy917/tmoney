import { Directive, ElementRef, Input, Renderer} from '@angular/core';

@Directive({
    selector: '[ngD]'
})
export class PathDDirective{
    @Input() 
    set ngD(ngD){
        this.renderer.setElementAttribute(this.el.nativeElement,'d',ngD);
    }
    constructor(private el: ElementRef, private renderer: Renderer){}
}