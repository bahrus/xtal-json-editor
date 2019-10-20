declare class JSONEditor{
    constructor(a,b);
}
import {XtallatX} from 'xtal-element/xtal-latx.js';
import {define} from 'trans-render/define.js';
import {hydrate} from 'trans-render/hydrate.js';

//const cs_src = import.meta['url']; //bundlephobia still doesn;t support

//const base = cs_src.split('/').slice(0, -1).join('/');
const base = 'https://unpkg.com/xtal-json-editor@0.0.40';

// declare var JSONEditor;
declare var xtal_json_editor;


interface IDynamicJSLoadStep {
    src?: string;
}
const input = 'input';
const options = 'options';
const archive = 'archive';
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

/**
 * @element xtal-json-editor
 * @event edited-result-changed
 */
export class XtalJsonEditor extends XtallatX(hydrate(HTMLElement))  {
    static get is() { return 'xtal-json-editor'; }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    /************ Properties *****************/
    _input: object | undefined = undefined;
    _history: object[] | undefined = undefined;
    get input() {
        return this._archive ? this._history : this._input;
    }
    /**
     * Object to edit / view
     * @attr
     */
    set input(val) {
        if(this._archive){
            if(this._history === undefined) this._history = [];
            this._history.push(val);
        }else{
            this._input = val;
        }
        
        this.onPropsChange();
    }

    _options: object;
    get options() {
        return this._options;
    }

    /**
     * Options for JSON Editor.  See https://github.com/josdejong/jsoneditor/blob/master/docs/api.md#configuration-options
     * @attr
     */
    set options(val) {
        this._options = val;
        this.onPropsChange();
    }

    _archive: boolean = false;
    get archive(){
        return this._archive;
    }
    /**
     * Archive previous values
     * @attr
     */
    set archive(nv){
        this.attr(archive, nv, '');
    }

    value: any;
    _editedResult: object;
    get editedResult() {
        return this._editedResult;
    }
    /**
     * Edited result
     */
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
    /**
     * Indicated whether edited result should be stringified as text.
     * @attr
     */
    set as(val) {
        this.attr(as, val)
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([input, options, as, archive]);
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
            case archive:
                this._archive = newVal !== null;
                break;

        }
    }

    _connected = false;
    connectedCallback() {
        this._connected = true;
        this.propUp([input, options, as, archive])
        this.onPropsChange();
    }
    _jsonEditor: any;
    onPropsChange() {
        if (!this._connected || (this._input === undefined && !this._history === undefined) || !this._options) return;
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
        this._jsonEditor.set(this._input || this._history);
    }
}

function init() {
    define(XtalJsonEditor);
}
