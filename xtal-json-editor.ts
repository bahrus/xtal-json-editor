///<reference path="node_modules/@types/jsoneditor/index.d.ts"/>
//declare type JSONEditor = jsoneditor.JSONEditor;

export interface  IXtalJsonEditorProperties{
    watch: object | polymer.PropObjectType
    options: jsoneditor.JSONEditorOptions | polymer.PropObjectType,
    waitForOptions: boolean | polymer.PropObjectType,
    editedResult: object | polymer.PropObjectType,
    as: string | polymer.PropObjectType,
    height: string | polymer.PropObjectType,
    enableDebugger: boolean | polymer.PropObjectType,
    width: string | polymer.PropObjectType
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
            watch: object; options: jsoneditor.JSONEditorOptions; editedResult; waitForOptions;
            inDebugMode;
            enableDebugger;
            _jsonEditor: JSONEditor;as;height;width
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
                    },
                    enableDebugger:{
                        type: Boolean,
                        observer: 'onEnableDebugger'
                    }

                };
            }

            get jsonEditor() {
                return this._jsonEditor;
            }
            // toggleVisibility(e: Event){
            //     if(!this.inDebugMode){
            //         this.$.xcontainer.style.display = 'block';
            //     }else{
            //         this.$.xcontainer.style.display = 'none';
            //     }
            // }
            namesToBlock = ['$', '__proto__', 'root'];
            enableDebug(e: Event){
                this.style.display = 'block';
                const objToEdit = {};
                const ownProps = Object.getOwnPropertyNames(e.srcElement);
                ownProps.forEach(name => {
                    if(name.startsWith('_')) return;
                    if(this.namesToBlock.indexOf(name) !==-1 ) return;
                    objToEdit[name] = e.srcElement[name];
                });
                console.log(objToEdit);
                this.watch = objToEdit;
            }
            onEnableDebugger(){
                if(this.enableDebugger){
                    this.style.display = 'none';
                    const _this = this;
                    document.body.addEventListener('click', e =>{
                        if(e.ctrlKey){
                            const tn = e.srcElement.tagName;
                            console.log(tn);
                            if(tn.indexOf('-') > -1){
                                if(customElements.get(tn.toLowerCase())){
                                    console.log('enableDebug');
                                    _this.enableDebug(e);
                                }
                            }
                        }
                        
                    })
                }
            }
            
            onPropsChange(newVal) {
                console.select
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