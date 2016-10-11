import { Directive, ElementRef, Input, Renderer} from '@angular/core';

@Directive({
    selector: '(onend_c)'
})
export class SVGAnimateOnEnd{
    @Input()
    set onend_c(onend_c:()=>void){
        this.renderer.listen(this.el.nativeElement,'endEvent',onend_c);
    }
    constructor(private el: ElementRef, private renderer: Renderer){}
}