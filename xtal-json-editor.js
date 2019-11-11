import { XtalElement } from "xtal-element/xtal-element.js";
import { createTemplate, newRenderContext } from "xtal-element/utils.js";
import { define } from "trans-render/define.js";
import { XtalJsonObject } from "./xtal-json-object.js";
const keySymbol = Symbol();
import("./xtal-json-object.js");
import("p-et-alia/p-d-x.js").then(module => {
    module.extend({
        name: "xtal-json-editor-get-val-type",
        valFromEvent: (e) => {
            const txt = e.target;
            if (!txt)
                return;
            const val = txt.value.trim();
            const val0 = val[0];
            const valC = val[val.length - 1];
            if (val0 === '"' && valC === '"') {
                return "string";
            }
            else if (val0 === "{" && valC === "}") {
                return "object";
            }
            else if (val0 === "[" && valC === "]") {
                return "array";
            }
            else if (!isNaN(val)) {
                return "number";
            }
            else if (val === "true" || val === "false") {
                return "boolean";
            }
            else {
                return "unknown";
            }
        }
    });
    module.extend({
        name: "self-destruct-if-cleared",
        valFromEvent: (e) => {
            const txt = e.target;
            const prevValue = txt[keySymbol];
            if (txt.value.length === 0 &&
                prevValue !== undefined &&
                prevValue.length > 0) {
                txt.closest("section").remove();
            }
            txt[keySymbol] = txt.value;
        }
    });
});
const mainTemplate = createTemplate(/* html */ `
    <style>
      input {
        border: none;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        padding: 3px;
        margin-right: 2px;
      }

      [data-type="boolean"]>input[data-var="key"] {
        background-color: #B1C639;
      }

      [data-type="object"]>input[data-var="key"] {
        background-color: #E17000;
      }

      [data-type="unknown"]>input[data-var="key"] {
        background-color: rgb(223, 181, 210);
      }

      input[data-var="value"]{
          background-color: #ECF3C3;
      }
      details>summary::-webkit-details-marker{
       display:none;
      }

      details>summary {
        margin-top: 20px;
        list-style: none;
        cursor:pointer;
      }
      section {
          margin-left: 15px;
      }

    </style>

    <template id=entity>
        <section>
            <p-d-x-xtal-json-editor-get-val-type  
                on=input if="[data-var='value']" to=[-data-type] set-attr m=1
            ></p-d-x-xtal-json-editor-get-val-type>
            <p-d-x-xtal-json-editor-get-val-type  
                on=input if="[data-var='value']" to=[-lhs] val=target.dataset.type m=1
            ></p-d-x-xtal-json-editor-get-val-type>
            <p-d-x-self-destruct-if-cleared on=input if="[data-var='key']"></p-d-x-self-destruct-if-cleared>
            <div -data-type data-type=unknown>
                <input data-var="key" disabled value=key>
                <input disabled=3 data-var=value>
                <p-d on=object-val noblock from=div to=[-obj] val=detail.value m=1></p-d>
            </div>
            
            <if-diff-then-stiff if -lhs equals rhs="object" data-key-name=isObject m=2></if-diff-then-stiff>
            <div data-is-object=0>
                <template>
                    <xtal-json-object -obj></xtal-json-object>
                </template>
            </div>
        </section>      
    </template>
    <xtal-json-object></xtal-json-object>
`);
const obj = 'obj';
export class XtalJsonEditor extends XtalElement {
    static get is() {
        return "xtal-json-editor";
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([obj]);
    }
    get mainTemplate() {
        return mainTemplate;
    }
    get initRenderContext() {
        return newRenderContext({
            [XtalJsonObject.is]: ({ target }) => {
                target.obj = this.obj;
            }
        });
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
    get readyToInit() {
        return this._obj !== undefined;
    }
}
define(XtalJsonEditor);
