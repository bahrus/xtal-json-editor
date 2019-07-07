import { XtallatX } from 'xtal-element/xtal-latx.js';
import { define } from 'trans-render/define.js';
import { hydrate } from 'trans-render/hydrate.js';
const cs_src = import.meta['url'];
const base = cs_src.split('/').slice(0, -1).join('/');
const input = 'input';
const options = 'options';
const archive = 'archive';
const as = 'as';
const template = document.createElement('template');
let css;
fetch(base + '/jsoneditor.min.css', {
    credentials: 'same-origin'
}).then(resp => {
    resp.text().then(content => {
        const searchStr = 'img/jsoneditor-icons.svg';
        css = replaceAll(content, searchStr, base + '/' + searchStr);
        checkIfReady();
    });
});
let jsLoaded = false;
const scriptTag = document.createElement('script');
scriptTag.src = base + '/jsoneditor-minimalist.min.js';
scriptTag.onload = (e => {
    jsLoaded = true;
    checkIfReady();
});
document.head.appendChild(scriptTag);
function replaceAll(str, search, replace) {
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
export class XtalJsonEditor extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super();
        /************ Properties *****************/
        this._input = undefined;
        this._history = undefined;
        /***********End Properties ************/
        /***************** Attributes  */
        this._as = 'text';
        this._connected = false;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    static get is() { return 'xtal-json-editor'; }
    get input() {
        return this._archive ? this._history : this._input;
    }
    set input(val) {
        if (this._archive) {
            if (this._history === undefined)
                this._history = [];
            this._history.push(val);
        }
        else {
            this._input = val;
        }
        this.onPropsChange();
    }
    get options() {
        return this._options;
    }
    set options(val) {
        this._options = val;
        this.onPropsChange();
    }
    get archive() {
        return this._archive;
    }
    set archive(nv) {
        this.attr(archive, nv, '');
    }
    get editedResult() {
        return this._editedResult;
    }
    set editedResult(val) {
        this._editedResult = val;
        this.value = val;
        this.de('edited-result', {
            value: val
        });
    }
    get as() {
        return this._as;
    }
    set as(val) {
        this.attr(as, val);
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([input, options, as, archive]);
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case input:
            case options:
                this[name] = JSON.parse(newVal);
                break;
            case as:
                this._as = newVal;
                break;
            case archive:
                this._archive = newVal !== null;
                break;
        }
    }
    connectedCallback() {
        this._connected = true;
        this.propUp([input, options, as, archive]);
        this.onPropsChange();
    }
    onPropsChange() {
        if (!this._connected || (this._input === undefined && !this._history === undefined) || !this._options)
            return;
        if (!this._options['onChange']) {
            this.options['onChange'] = () => {
                let result = this._jsonEditor.get();
                if (this.as === 'text')
                    result = JSON.stringify(result);
                this.editedResult = result;
            };
        }
        //}
        const container = this.shadowRoot.querySelector('#xcontainer');
        container.innerHTML = '';
        this._jsonEditor = new JSONEditor(container, this.options);
        this._jsonEditor.set(this._input || this._history);
    }
}
function init() {
    define(XtalJsonEditor);
}
