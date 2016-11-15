/**
 * @fileoverview This file is generated by the Angular 2 template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
 /* tslint:disable */

import * as import0 from '../../src/chart-sub.component';
import * as import1 from '@angular/core/src/change_detection/change_detection';
import * as import2 from '@angular/core/src/linker/view';
import * as import3 from '@angular/core/src/linker/view_utils';
import * as import4 from '@angular/core/src/render/api';
import * as import5 from '@angular/core/src/metadata/view';
import * as import6 from '@angular/core/src/linker/view_type';
import * as import7 from '@angular/core/src/linker/component_factory';
import * as import8 from '@angular/core/src/linker/query_list';
import * as import9 from '@angular/core/src/linker/element_ref';
export class Wrapper_InfiniteChartSubComponent {
  /*private*/ _eventHandler:Function;
  context:import0.InfiniteChartSubComponent;
  /*private*/ _changed:boolean;
  /*private*/ _changes:{[key: string]:any};
  /*private*/ _expr_0:any;
  subscription0:any;
  constructor() {
    this._changed = false;
    this._changes = {};
    this.context = new import0.InfiniteChartSubComponent();
    this._expr_0 = import1.UNINITIALIZED;
  }
  ngOnDetach(view:import2.AppView<any>,componentView:import2.AppView<any>,el:any):void {
  }
  ngOnDestroy():void {
    (this.subscription0 && this.subscription0.unsubscribe());
  }
  check_p(currValue:any,throwOnChange:boolean,forceUpdate:boolean):void {
    if ((forceUpdate || import3.checkBinding(throwOnChange,this._expr_0,currValue))) {
      this._changed = true;
      this.context.p = currValue;
      this._changes['p'] = new import1.SimpleChange(this._expr_0,currValue);
      this._expr_0 = currValue;
    }
  }
  ngDoCheck(view:import2.AppView<any>,el:any,throwOnChange:boolean):boolean {
    var changed:any = this._changed;
    this._changed = false;
    if (!throwOnChange) { if (changed) {
      this.context.ngOnChanges(this._changes);
      this._changes = {};
    } }
    return changed;
  }
  checkHost(view:import2.AppView<any>,componentView:import2.AppView<any>,el:any,throwOnChange:boolean):void {
  }
  handleEvent(eventName:string,$event:any):boolean {
    var result:boolean = true;
    return result;
  }
  subscribe(view:import2.AppView<any>,_eventHandler:any,emit0:boolean):void {
    this._eventHandler = _eventHandler;
    if (emit0) { (this.subscription0 = this.context.output.subscribe(_eventHandler.bind(view,'output'))); }
  }
}
var renderType_InfiniteChartSubComponent_Host:import4.RenderComponentType = import3.createRenderComponentType('',0,import5.ViewEncapsulation.None,([] as any[]),{});
class View_InfiniteChartSubComponent_Host0 extends import2.AppView<any> {
  _el_0:any;
  compView_0:import2.AppView<import0.InfiniteChartSubComponent>;
  _InfiniteChartSubComponent_0_3:Wrapper_InfiniteChartSubComponent;
  constructor(viewUtils:import3.ViewUtils,parentView:import2.AppView<any>,parentIndex:number,parentElement:any) {
    super(View_InfiniteChartSubComponent_Host0,renderType_InfiniteChartSubComponent_Host,import6.ViewType.HOST,viewUtils,parentView,parentIndex,parentElement,import1.ChangeDetectorStatus.CheckAlways);
  }
  createInternal(rootSelector:string):import7.ComponentRef<any> {
    this._el_0 = import3.selectOrCreateRenderHostElement(this.renderer,'g',new import3.InlineArray2(2,'infinite-sub',''),rootSelector,(null as any));
    this.compView_0 = new View_InfiniteChartSubComponent0(this.viewUtils,this,0,this._el_0);
    this._InfiniteChartSubComponent_0_3 = new Wrapper_InfiniteChartSubComponent();
    this.compView_0.create(this._InfiniteChartSubComponent_0_3.context);
    this.init(this._el_0,((<any>this.renderer).directRenderer? (null as any): [this._el_0]),(null as any));
    return new import7.ComponentRef_<any>(0,this,this._el_0,this._InfiniteChartSubComponent_0_3.context);
  }
  injectorGetInternal(token:any,requestNodeIndex:number,notFoundResult:any):any {
    if (((token === import0.InfiniteChartSubComponent) && (0 === requestNodeIndex))) { return this._InfiniteChartSubComponent_0_3.context; }
    return notFoundResult;
  }
  detectChangesInternal(throwOnChange:boolean):void {
    this._InfiniteChartSubComponent_0_3.ngDoCheck(this,this._el_0,throwOnChange);
    this.compView_0.detectChanges(throwOnChange);
  }
  destroyInternal():void {
    this.compView_0.destroy();
    this._InfiniteChartSubComponent_0_3.ngOnDestroy();
  }
  visitRootNodesInternal(cb:any,ctx:any):void {
    cb(this._el_0,ctx);
  }
}
export const InfiniteChartSubComponentNgFactory:import7.ComponentFactory<import0.InfiniteChartSubComponent> = new import7.ComponentFactory<import0.InfiniteChartSubComponent>('g[infinite-sub]',View_InfiniteChartSubComponent_Host0,import0.InfiniteChartSubComponent);
const styles_InfiniteChartSubComponent:any[] = ([] as any[]);
var renderType_InfiniteChartSubComponent:import4.RenderComponentType = import3.createRenderComponentType('',0,import5.ViewEncapsulation.None,styles_InfiniteChartSubComponent,{});
export class View_InfiniteChartSubComponent0 extends import2.AppView<import0.InfiniteChartSubComponent> {
  _viewQuery_path_elem_0:import8.QueryList<any>;
  _text_0:any;
  _el_1:any;
  _text_2:any;
  _el_3:any;
  _text_4:any;
  constructor(viewUtils:import3.ViewUtils,parentView:import2.AppView<any>,parentIndex:number,parentElement:any) {
    super(View_InfiniteChartSubComponent0,renderType_InfiniteChartSubComponent,import6.ViewType.COMPONENT,viewUtils,parentView,parentIndex,parentElement,import1.ChangeDetectorStatus.CheckAlways);
  }
  createInternal(rootSelector:string):import7.ComponentRef<any> {
    const parentRenderNode:any = this.renderer.createViewRoot(this.parentElement);
    this._viewQuery_path_elem_0 = new import8.QueryList<any>();
    this._text_0 = this.renderer.createText(parentRenderNode,'\n            ',(null as any));
    this._el_1 = import3.createRenderElement(this.renderer,parentRenderNode,':svg:path',import3.EMPTY_INLINE_ARRAY,(null as any));
    this._text_2 = this.renderer.createText(parentRenderNode,'\n            ',(null as any));
    this._el_3 = import3.createRenderElement(this.renderer,parentRenderNode,':svg:foreignObject',import3.EMPTY_INLINE_ARRAY,(null as any));
    this._text_4 = this.renderer.createText(parentRenderNode,'\n    ',(null as any));
    this._viewQuery_path_elem_0.reset([new import9.ElementRef(this._el_1)]);
    this.context.path = this._viewQuery_path_elem_0.first;
    this.init((null as any),((<any>this.renderer).directRenderer? (null as any): [
      this._text_0,
      this._el_1,
      this._text_2,
      this._el_3,
      this._text_4
    ]
    ),(null as any));
    return (null as any);
  }
}