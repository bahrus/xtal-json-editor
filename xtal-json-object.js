import { createTemplate } from 'xtal-element/utils.js';
import { XtalElement } from 'xtal-element/xtal-element.js';
import { define } from 'trans-render/define.js';
export const mainTemplate = createTemplate(/* html */ `
  <b-c-c copy from=object noshadow></b-c-c>
`);
import('carbon-copy/b-c-c.js');
export class XtalJsonObject extends XtalElement {
    static get is() { return 'xtal-json-object'; }
    get obj() {
        return this._obj;
    }
    set obj(nv) {
        this._obj = nv;
    }
    get mainTemplate() {
        return mainTemplate;
    }
    get readyToInit() {
        return true;
    }
    get noShadow() {
        return true;
    }
}
define(XtalJsonObject);
