declare class JSONEditor{
    constructor(a,b);
}
import {XtallatX} from 'xtal-element/xtal-latx.js';
import {define} from 'trans-render/define.js';
import {hydrate} from 'trans-render/hydrate.js';

const cs_src = import.meta['url'];

const base = cs_src.split('/').slice(0, -1).join('/');

// declare var JSONEditor;
declare var xtal_json_editor;


interface IDynamicJSLoadStep {
    src?: string;
}
const input = 'input';
const options = 'options';
const as = 'as';
const template = document.createElement('template');
let css: string;
fetch(base + '/jsoneditor.min.css', {
    credentials: 'same-origin'
}).then(resp => {
    resp.text().then(content => {
        const searchStr = 'img/jsoneditor-icons.svg'
        css = replaceAll(content, searchStr, base + '/' + searchStr);
        checkIfReady();
    })
});
let jsLoaded = false;
const scriptTag = document.createElement('script');
scriptTag.src = base + '/jsoneditor-minimalist.min.js';
scriptTag.onload = (e => {
    jsLoaded = true;
    checkIfReady();
})
document.head.appendChild(scriptTag);
function replaceAll(str: string, search: string, replace: string) {
    return str.split(search).join(replace);
}
function checkIfReady() {
    if (jsLoaded && css) {
        template.innerHTML = `
            <style>
            :host {
                display: block;
            }
            ${css}
            </style>
            <div id="xcontainer" style="height:100%;width:100%"></div>            
            `;
        init();
    }
}


export class XtalJsonEditor extends XtallatX(hydrate(HTMLElement))  {
    static get is() { return 'xtal-json-editor'; }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    /************ Properties *****************/
    _input: object;
    get input() {
        return this._input;
    }
    set input(val) {
        this._input = val;
        this.onPropsChange();
    }

    _options: object;
    get options() {
        return this._options;
    }

    set options(val) {
        this._options = val;
        this.onPropsChange();
    }

    value: any;
    _editedResult: object;
    get editedResult() {
        return this._editedResult;
    }
    
    set editedResult(val: object) {
        this._editedResult = val;
        this.value = val;
        this.de('edited-result',{
            value: val
        });
    }
    /***********End Properties ************/
    /***************** Attributes  */
    _as = 'text';
    get as() {
        return this._as;
    }
    set as(val) {
        this.attr(as, val)
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([input, options, as]);
    }
    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        switch (name) {
            case input:
            case options:
                this[name] = JSON.parse(newVal);
                break;
            case as:
                this._as = newVal;
                break;
        }
    }

    _connected = false;
    connectedCallback() {
        this._connected = true;
        this.propUp([input, options, as])
        this.onPropsChange();
    }
    _jsonEditor: any;
    onPropsChange() {
        if (!this._connected || !this._input || !this._options) return;
        if (!this._options['onChange']) {
            this.options['onChange'] = () => {
                let result = this._jsonEditor.get();
                if (this.as === 'text') result = JSON.stringify(result);
                this.editedResult = result;
            }
        }
        //}
        const container = this.shadowRoot.querySelector('#xcontainer');
        container.innerHTML = '';
        this._jsonEditor = new JSONEditor(container, this.options);
        this._jsonEditor.set(this._input);
    }
}

function init() {
    define(XtalJsonEditor);
}
