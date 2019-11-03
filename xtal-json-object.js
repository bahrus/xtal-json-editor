import { createTemplate } from 'xtal-element/utils.js';
import { XtalElement } from 'xtal-element/xtal-element.js';
import { define } from 'trans-render/define.js';
export const mainTemplate = createTemplate(/* html */ `
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
export class XtalJsonObject extends XtalElement {
    static get is() { return 'xtal-json-object'; }
    static get observedAttributes() {
        return super.observedAttributes.concat([obj]);
    }
    get addNewButton() {
        if (this._addNewButton === undefined) {
            this._addNewButton = this.querySelector('[data-copy]');
        }
        return this._addNewButton;
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
define(XtalJsonObject);
