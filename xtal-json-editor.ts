///<reference path="node_modules/@types/jsoneditor/index.d.ts"/>
//declare type JSONEditor = jsoneditor.JSONEditor;

export interface  IXtalJsonEditorProperties{
    watch: object | polymer.PropObjectType
    options: jsoneditor.JSONEditorOptions | polymer.PropObjectType,
    waitForOptions: boolean | polymer.PropObjectType,
    editedResult: object | polymer.PropObjectType,
    as: string | polymer.PropObjectType,
    height: string | polymer.PropObjectType,
    width: string | polymer.PropObjectType
}
module xtal.elements{
    function initXtalJsonEditor() {
        if (customElements.get('xtal-json-editor'))
            return;
        /**
        * Polymer based web component wrapper around the awesome, most excellent JSON Editor api, which can be found at https://github.com/josdejong/jsoneditor
        *
        * @customElement
        * @polymer
        * @demo demo/index.html
        */
        class XtalJsonEditor extends Polymer.Element implements IXtalJsonEditorProperties {
            watch: object; options: jsoneditor.JSONEditorOptions; editedResult; waitForOptions;
            _jsonEditor: JSONEditor;as;height;width
            static get is() { return 'xtal-json-editor'; }
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
                    },
                    /**
                     * Don't bind editor to JSON object until options are set
                     */
                    waitForOptions:{
                        type: Boolean,
                        observer: 'onPropsChange'
                    },
                    /**
                     * Expression for where to place the results of the edited json
                     */
                    editedResult:{
                        type: Object,
                        notify: true,
                        readOnly: true
                    },
                    /**
                     * Specify format for results:  text or json
                     */
                    as:{
                        type: String,
                        value: 'text'
                    },
                    height:{
                        type: String,
                        value: '400px'
                    },
                    width:{
                        type: String,
                        value: '400px'
                    }

                };
            }

            get jsonEditor() {
                return this._jsonEditor;
            }
            
            onPropsChange(newVal) {
                if (!this.watch) return;
                if(this.waitForOptions && !this.options) return;
                const _this = this;
                if(!this.options) this.options = {};
                //if(this.options){
                if(!this.options.onChange){
                    this.options.onChange = () =>{
                        let result = this._jsonEditor.get();
                        if(this.as === 'text') result = JSON.stringify(result);
                        this['_setEditedResult'](result);
                    }
                }
                //}
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