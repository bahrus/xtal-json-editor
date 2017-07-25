///<reference path="node_modules/@types/jsoneditor/index.d.ts"/>
//declare type JSONEditor = jsoneditor.JSONEditor;

export interface  IXtalJsonEditorProperties{
    watch: object | polymer.PropObjectType
    options: jsoneditor.JSONEditorOptions | polymer.PropObjectType,
}
module xtal.elements{
    function initXtalJsonEditor() {
        const tagName = 'xtal-json-editor';
        if (customElements.get(tagName))
            return;
        /**
        * Polymer based web component wrapper around the awesome, most excellent JSON Editor api, which can be found at https://github.com/josdejong/jsoneditor
        *
        * @customElement
        * @polymer
        * @demo demo/index.html
        */
        class XtalJsonEditor extends Polymer.Element implements IXtalJsonEditorProperties {
            watch: object; options: jsoneditor.JSONEditorOptions
            _jsonEditor: JSONEditor;
            static get is() { return tagName; }
            static get properties() {
                return {
                    /**
                    * The expression that points to an object to edit.
                    */
                    watch: {
                        type: Object,
                        observer: 'onPropsChange'
                    },
                    /**
                     * JsonEditor options, implements jsoneditor.JSONEditorOptions
                     */
                    options: {
                        type: Object,
                        observer: 'onPropsChange'
                    }
                };
            }

            get jsonEditor() {
                return this._jsonEditor;
            }
            
            onPropsChange(newVal) {
                if (!this.watch)
                    return;
                this.$.xcontainer.innerHTML = '';
                this._jsonEditor = new JSONEditor(this.$.xcontainer, this.options);
                this._jsonEditor.set(this.watch);
            }
        }
        customElements.define(XtalJsonEditor.is, XtalJsonEditor);
    }

    const testSyncKey = 'xtal_elements_json_editor_sync';
    if (window[testSyncKey]) {
        initXtalJsonEditor();
        delete window[testSyncKey];
    }
    else {
        customElements.whenDefined('poly-prep').then(() => {
            initXtalJsonEditor();
        });
        customElements.whenDefined('full-poly-prep').then(() => {
            initXtalJsonEditor();
        });
    }
}