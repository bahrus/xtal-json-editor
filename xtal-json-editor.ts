///<reference path="node_modules/@types/jsoneditor/index.d.ts"/>
//declare type JSONEditor = jsoneditor.JSONEditor;

export interface  IXtalJsonEditorProperties{
    cssPath: string | polymer.PropObjectType,
    watch: object | polymer.PropObjectType,
    options: jsoneditor.JSONEditorOptions | polymer.PropObjectType,
    waitForOptions: boolean | polymer.PropObjectType,
    editedResult: object | polymer.PropObjectType,
    as: string | polymer.PropObjectType,
    height: string | polymer.PropObjectType,
    width: string | polymer.PropObjectType
}
(function () {
    let cs; 
    function initXtalJsonEditor() {
        if (customElements.get('xtal-json-editor')){
            return;
        }
        /**
        * Polymer based web component wrapper around the awesome, most excellent JSON Editor api, which can be found at https://github.com/josdejong/jsoneditor
        *
        * @customElement
        * @polymer
        * @demo demo/index.html
        */
        class XtalJsonEditor extends Polymer.Element implements IXtalJsonEditorProperties {
            watch: object; options: jsoneditor.JSONEditorOptions; editedResult; waitForOptions;
            _jsonEditor: JSONEditor;as;height;width;cssPath;
            cs = cs;
            //from https://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
            absolute(base, relative) {
                var stack = base.split("/"),
                    parts = relative.split("/");
                stack.pop(); // remove current file name (or empty string)
                // (omit if "base" is the current folder without trailing slash)
                for (var i = 0; i < parts.length; i++) {
                    if (parts[i] == ".")
                        continue;
                    if (parts[i] == "..")
                        stack.pop();
                    else
                        stack.push(parts[i]);
                }
                return stack.join("/");
            }
            connectedCallback(){
                super.connectedCallback();
                if(!this.cssPath){
                    //const cs = document.currentScript;
                    if(cs){
                        this.cssPath = this.absolute(cs.baseURI, 'jsoneditor.min.css');
                    }else{
                        this.cssPath = '/bower_components/xtal-json-editor/jsoneditor.min.css';
                    }
                }
                console.log(this.cssPath);
            }
            static get is() { return 'xtal-json-editor'; }
            static get properties() {
                return {
                    /**
                     * Path to get the styling
                     */
                    cssPath:{
                        type: String
                    },
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
                //const _this = this;
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

    function WaitForPolymer()
    {
        cs = document.currentScript;
        if ((typeof Polymer !== 'function') || (typeof Polymer.Element !== 'function')) {
           setTimeout( WaitForPolymer, 100);
           return;
        }
        initXtalJsonEditor();
    }
    WaitForPolymer();
})();