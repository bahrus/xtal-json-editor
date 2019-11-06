import {createTemplate, newRenderContext} from 'xtal-element/utils.js';
import {XtalElement} from 'xtal-element/xtal-element.js';
import {define} from 'trans-render/define.js';
import {decorate} from 'trans-render/decorate.js';
import {BCC_WC} from 'carbon-copy/typings.js';
import {init} from 'trans-render/init.js';

export const mainTemplate = createTemplate(/* html */`
<details open>
    <p-d on="click" if=[data-copy] to=[-copy] val=target.dataset.copy skip-init m=1></p-d>
    <summary>+ {}</summary>
    <b-c-c -copy from=entity noclear noshadow></b-c-c>
    <button disabled  data-copy=true>Add New Value</button>
</details>
`);
import('carbon-copy/b-c-c.js');
import('if-diff/if-diff-then-stiff.js');
const obj = 'obj';
export class XtalJsonObject extends XtalElement{
    static get is(){return 'xtal-json-object';}
    static get observedAttributes(){
        return super.observedAttributes.concat([obj]);
    }
    static _counter = 0;
    static get counter(){
        this._counter++;
        return this._counter;
    }
    get initRenderContext() {
        return newRenderContext({
            details:{
                'b-c-c': ({target}) =>{
                    const bcc = (<any>target) as BCC_WC;
                    bcc.renderContext = {
                        init: init,
                        Transform: {
                            section:{
                                'div[data-type]':{
                                    'input[data-var="key"]': ({target}) => (<any>target).value = 'key' + XtalJsonObject.counter,
                                }

                            }
                        }
                    }
                },
                // button: ({target}) =>{
                //     this.addNewButton = target as HTMLButtonElement;
                //     decorate(target, {
                //         propDefs:{
                //             counter: 0
                //         },
                //         on:{
                //             click: function(e){
                //                 this.counter++;
                //             }
                //         },
                //         methods:{
                //             onPropsChange(){
                //                 console.log('iah2');
                //                 this.setAttribute('data-counter', this.counter);
                //             }
                //         }
                //     });
                // }
            }
        });
    }
    addNewButton!: HTMLButtonElement;

    addNewValue(){
        this.addNewButton.click();
    }
    attributeChangedCallback(n: string, ov: string, nv: string){
        switch(n){
            case obj:
                this._obj = JSON.parse(nv);
                break;
        }
        super.attributeChangedCallback(n, ov, nv);
    }
    _obj: object | undefined;
    get obj(){
        return this._obj;
    }
    set obj(nv){
        this._obj = nv;
        this.onPropsChange();
    }
    get mainTemplate(){
        return mainTemplate;
    }
    get readyToInit(){
        return this._obj !== undefined;
    }
    get noShadow(){
        return true;
    }
    connectedCallback(){
        this.propUp([obj]);
        super.connectedCallback();
    }
    onPropsChange() : boolean{
        if(!super.onPropsChange()) return false;
        return true;
    }
}
define(XtalJsonObject);

declare global {
    interface HTMLElementTagNameMap {
        'xtal-json-object': XtalJsonObject,
    }
}