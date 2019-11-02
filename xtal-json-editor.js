//import {XtalJson} from './xtal-json-object.js';
import { extend } from "p-et-alia/p-d-x.js";
import { XtalElement } from "xtal-element/xtal-element.js";
import { createTemplate } from "xtal-element/utils.js";
import { define } from 'trans-render/define.js';
extend({
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
    </style>
    <template id=object>
        <details>
          <summary>
            <button data-copy=true>Add New Value</button>
            <p-d on="click" to=[-copy] val=target.dataset.copy skip-init></p-d>
            <b-c-c -copy from=entity noclear noshadow></b-c-c>
          </summary>
        </details>
    </template>
    <template id=entity>
        <section>
            <p-d-x-get-val-type if="[data-var='value']" on=input to=[-data-type] val=target.dataset.type set-attr></p-d-x-get-val-type>
            <div -data-type data-type=unknown>
                <input data-var="key"><input data-var=value>
            </div>
        </section>      
    </template>
    <xtal-json-object></xtal-json-object>
`);
import("./xtal-json-object.js");
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
