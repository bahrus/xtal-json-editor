import { createTemplate, newRenderContext } from 'xtal-element/utils.js';
import { XtalElement } from 'xtal-element/xtal-element.js';
import { define } from 'trans-render/define.js';
import { init } from 'trans-render/init.js';
import 'carbon-copy/b-c-c.js';
export const mainTemplate = createTemplate(/* html */ `
<details open>
    <p-d on="click" if=[data-copy] to=[-copy] val=target.dataset.copy skip-init m=1></p-d>
    <summary>+ {}</summary>
    <b-c-c -copy from=entity noclear noshadow></b-c-c>
    <button disabled  data-copy=true>Add New Value</button>
</details>
`);
//import('carbon-copy/b-c-c.js');
import('if-diff/if-diff-then-stiff.js');
const obj = 'obj';
export class XtalJsonObject extends XtalElement {
    static get is() { return 'xtal-json-object'; }
    static get observedAttributes() {
        return super.observedAttributes.concat([obj]);
    }
    static get counter() {
        this._counter++;
        return this._counter;
    }
    get initRenderContext() {
        return newRenderContext({
            details: {
                'b-c-c': ({ target }) => {
                    const bcc = target;
                    bcc.renderContext = {
                        init: init,
                        Transform: {
                            section: {
                                'div[data-type]': {
                                    'input[data-var="key"]': ({ target }) => {
                                        const txt = target;
                                        if (this._nameValPair) {
                                            txt.value = this._nameValPair.name;
                                        }
                                        else {
                                            txt.value = 'key' + XtalJsonObject.counter;
                                        }
                                    },
                                    'input[data-var="value"]': ({ target }) => {
                                        const txt = target;
                                        if (this._nameValPair) {
                                            txt.value = this._nameValPair.val;
                                        }
                                        else {
                                        }
                                    }
                                }
                            }
                        }
                    };
                },
                button: ({ target }) => {
                    this.addNewButton = target;
                }
            }
        });
    }
    addNewValue() {
        this.addNewButton.click();
    }
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case obj:
                this._obj = JSON.parse(nv);
                break;
        }
        super.attributeChangedCallback(n, ov, nv);
    }
    get obj() {
        return this._obj;
    }
    set obj(nv) {
        this._obj = nv;
        this.onPropsChange();
    }
    afterInitRenderCallback() {
        if (this._obj === undefined)
            return;
        for (var key in this._obj) {
            this._nameValPair = {
                name: key,
                val: this._obj[key]
            };
            this.addNewValue();
        }
        delete this._nameValPair;
    }
    get mainTemplate() {
        return mainTemplate;
    }
    get readyToInit() {
        return this._obj !== undefined;
    }
    get noShadow() {
        return true;
    }
    connectedCallback() {
        this.propUp([obj]);
        super.connectedCallback();
    }
    onPropsChange() {
        if (!super.onPropsChange())
            return false;
        return true;
    }
}
XtalJsonObject._counter = 0;
define(XtalJsonObject);
