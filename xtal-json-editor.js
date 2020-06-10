import { XtalElement, define } from 'xtal-element/XtalElement.js';
const cs_src = import.meta.url;
const base = cs_src.split('/').slice(0, -1).join('/');
const template = document.createElement('template');
let css;
fetch(base + '/jsoneditor.min.css').then(resp => {
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
            <div style="height:100%;width:100%"></div>            
            `;
        init();
    }
}
export const PropActions = {
    syncHistory: ({ input, self }) => {
        if (self.archive) {
            if (self.history === undefined)
                self.history = [];
            self.history.push(input);
        }
    },
    syncValue: ({ editedResult, self }) => {
        self.value = editedResult;
    },
};
const containerSym = Symbol();
/**
 * @element xtal-json-editor
 * @event edited-result-changed
 */
let XtalJsonEditor = /** @class */ (() => {
    class XtalJsonEditor extends XtalElement {
        constructor() {
            super(...arguments);
            this.readyToInit = true;
            this.readyToRender = true;
            this.mainTemplate = template;
            this.initTransform = {
                div: containerSym
            };
            this.updateTransforms = [
                ({ options, disabled, input, history, handleChange, self }) => ({
                    [containerSym]: ({ target }) => {
                        if (options === undefined || (undefined === input || history))
                            return;
                        if (self._jsonEditor === undefined) {
                            if (options['onChange'] === undefined) {
                                options['onChange'] = handleChange.bind(self);
                            }
                            self._jsonEditor = new JSONEditor(target, this.options);
                        }
                        self._jsonEditor.set(input || history);
                    }
                }),
            ];
            this.propActions = [
                PropActions.syncHistory,
                PropActions.syncValue
            ];
            /**
             * Indicated whether edited result should be stringified as text.
             * @attr
             */
            this.as = 'text';
        }
        handleChange() {
            let result = this._jsonEditor.get();
            if (this.as === 'text')
                result = JSON.stringify(result);
            this.editedResult = result;
        }
    }
    XtalJsonEditor.is = 'xtal-json-editor';
    XtalJsonEditor.attributeProps = ({ disabled, input, history, archive, options, editedResult, value, as }) => ({
        bool: [disabled, archive],
        obj: [input, history, options, editedResult, value],
        async: [input, options, disabled, history],
        jsonProp: [input, options],
        str: [as],
        notify: [editedResult, value]
    });
    return XtalJsonEditor;
})();
export { XtalJsonEditor };
function init() {
    define(XtalJsonEditor);
}
