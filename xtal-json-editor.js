import { XtallatX } from 'xtal-latx/xtal-latx.js';
import { define } from 'xtal-latx/define.js';
//firefox-induced car crash
let cs_src;
const preloadLink = self['xtal_json_editor'];
if (preloadLink) {
    cs_src = preloadLink.href;
}
else {
    const cs = document.currentScript;
    if (cs) {
        cs_src = cs.src;
    }
    else {
        cs_src = import.meta['url'];
    }
}
const base = cs_src.split('/').slice(0, -1).join('/');
const input = 'input';
const options = 'options';
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
class XtalJsonEditor extends XtallatX(HTMLElement) {
    constructor() {
        super();
        /***********End Properties ************/
        /***************** Attributes  */
        this._as = 'text';
        this._connected = false;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    static get is() { return 'xtal-json-editor'; }
    get input() {
        return this._input;
    }
    set input(val) {
        this._input = val;
        this.onPropsChange();
    }
    get options() {
        return this._options;
    }
    set options(val) {
        this._options = val;
        this.onPropsChange();
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
        return super.observedAttributes.concat([input, options, as]);
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
        }
    }
    connectedCallback() {
        this._connected = true;
        this._upgradeProperties([input, options, as]);
        this.onPropsChange();
    }
    onPropsChange() {
        if (!this._connected || !this._input || !this._options)
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
        this._jsonEditor.set(this._input);
    }
}
function init() {
    define(XtalJsonEditor);
}
//# sourceMappingURL=xtal-json-editor.js.map