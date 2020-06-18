declare class JSONEditor{
    constructor(a,b);
}
declare var xtal_json_editor;

import {XtalElement, AttributeProps, define} from 'xtal-element/XtalElement.js';
import {hydrate} from 'trans-render/hydrate.js';

const cs_src = import.meta.url;

const base = cs_src.split('/').slice(0, -1).join('/');

const template = document.createElement('template');
let css: string;
fetch(base + '/jsoneditor.min.css').then(resp => {
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
            <div style="height:100%;width:100%"></div>            
            `;
        init();
    }
}

export const PropActions = {
    syncHistory: ({input, self}: XtalJsonEditor) => {
        if(self.archive){
            if(self.history === undefined) self.history = [];
            self.history.push(input);
        }
    },
    syncValue: ({editedResult, self}: XtalJsonEditor) =>{
        self.value = editedResult;
    },

}

const containerSym = Symbol();

/**
 * @element xtal-json-editor
 * @event edited-result-changed
 */
export class XtalJsonEditor extends XtalElement {
    static is = 'xtal-json-editor';

    static attributeProps = ({disabled, input, history, archive, options, editedResult, value, as}: XtalJsonEditor) =>({
        bool: [disabled, archive],
        obj: [input, history, options, editedResult, value],
        async:[input, options, disabled, history],
        jsonProp: [input, options],
        str: [as],
        notify: [editedResult, value]
    } as AttributeProps);

    readyToInit = true;
    readyToRender = true;

    mainTemplate = template;

    initTransform = {
        div: containerSym
    };

    updateTransforms = [
        ({options, disabled, input, history, handleChange, self}: XtalJsonEditor) => ({
            [containerSym]: ({target})  => {
                if(options === undefined || (undefined === input || history)) return;
                if(self._jsonEditor === undefined){
                    if(options['onChange'] === undefined){
                        options['onChange'] = handleChange.bind(self);
                    }
                    self._jsonEditor = new JSONEditor(target, this.options);
                }
                self._jsonEditor.set(input || history);

            }
        }),
    
    ];

    propActions = [
        PropActions.syncHistory,
        PropActions.syncValue
    ]

    handleChange(){
        let result = this._jsonEditor.get();
        if (this.as === 'text') result = JSON.stringify(result);
        this.editedResult = result;
    }


    input: object | undefined;
    history: object[] | undefined;

    /**
     * Options for JSON Editor.  See https://github.com/josdejong/jsoneditor/blob/master/docs/api.md#configuration-options
     * @attr
     */
    options: object;


    /**
     * Archive previous values
     * @attr
     */
    archive: boolean;

    value: object;

    /**
     * Edited result
     */
    editedResult: object;

    /**
     * Indicated whether edited result should be stringified as text.
     * @attr
     */
    as = 'text';

    _jsonEditor: any;


}

function init() {
    define(XtalJsonEditor);
}
