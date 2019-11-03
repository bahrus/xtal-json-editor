import { XtalElement } from "xtal-element/xtal-element.js";
import { createTemplate } from "xtal-element/utils.js";
import { define } from 'trans-render/define.js';
import("./xtal-json-object.js");
import('p-et-alia/p-d-x.js').then(module => {
    module.extend({
        name: "get-val-type",
        valFromEvent: (e) => {
            const txt = e.target;
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

      details>summary::-webkit-details-marker{
       display:none;
      }

      details>summary {
        margin-top: 20px;
        list-style: none;
        cursor:pointer;
      }
    </style>
    <template id=object>
        <details open>
            <summary>+</summary>
            <button data-copy=true>Add New Value</button>
            <p-d on="click" to=[-copy] val=target.dataset.copy skip-init m=1></p-d>
            <b-c-c -copy from=entity noclear noshadow></b-c-c>
        </details>
    </template>
    <template id=entity>
        <section>
            <p-d-x-get-val-type  
                on=input if="[data-var='value']" to=[-data-type] set-attr m=1
            ></p-d-x-get-val-type>
            <p-d-x-get-val-type  
                on=input if="[data-var='value']" to=[-lhs] val=target.dataset.type m=1
            ></p-d-x-get-val-type>
            <div -data-type data-type=unknown>
                <input data-var="key"><input disabled=2 data-var=value>
            </div>
            <if-diff-then-stiff if -lhs equals rhs="object" data-key-name=isObject m=1></if-diff-then-stiff>
            <div data-is-object=0>
                <template>
                    <xtal-json-object></xtal-json-object>
                </template>
            </div>
        </section>      
    </template>
    <xtal-json-object></xtal-json-object>
`);
export class XtalJsonEditor extends XtalElement {
    static get is() {
        return "xtal-json-editor";
    }
    get mainTemplate() {
        return mainTemplate;
    }
    get readyToInit() {
        return true;
    }
}
define(XtalJsonEditor);
