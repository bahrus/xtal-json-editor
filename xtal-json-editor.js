import { extend } from 'p-et-alia/p-d-x.js';
extend({
    name: 'get-val-type',
    valFromEvent: (e) => {
        const txt = e.target;
        const val = txt.value.trim();
        const val0 = val[0];
        const valC = val[val.length - 1];
        if (val0 === '"' && valC === '"') {
            return 'string';
        }
        else if (val0 === '{' && valC === '}') {
            return 'object';
        }
        else if (val0 === '[' && valC === ']') {
            return 'array';
        }
        else if (!isNaN(val)) {
            return 'number';
        }
        else if (val === 'true' || val === 'false') {
            return 'boolean';
        }
        else {
            return 'unknown';
        }
    }
});
export class XtalJsonEditor extends HTMLElement {
}
