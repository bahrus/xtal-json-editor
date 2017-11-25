
//declare type JSONEditor = jsoneditor.JSONEditor;
declare var JSONEditor;
export interface  IXtalJsonEditorProperties{
    cssPath: string | polymer.PropObjectType,
    jsLibPath: string | polymer.PropObjectType,
    watch: object | polymer.PropObjectType,
    options: any | polymer.PropObjectType,
    waitForOptions: boolean | polymer.PropObjectType,
    editedResult: object | polymer.PropObjectType,
    as: string | polymer.PropObjectType,
    height: string | polymer.PropObjectType,
    width: string | polymer.PropObjectType
}
(function () {
    let cs;
    interface IDynamicJSLoadStep{
        src?: string;
    } 
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
            watch: object; options: any; editedResult; waitForOptions;
            _cssLoaded: boolean;_jsLoaded: boolean;
            _jsonEditor: any;as;height;width;cssPath;jsLibPath;
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
            downloadJSFilesInParallelButLoadInSequence(refs: IDynamicJSLoadStep[]){
                //see https://www.html5rocks.com/en/tutorials/speed/script-loading/
                return new Promise((resolve, reject) => {
                    const notLoadedYet : {[key: string] : boolean} = {};
                    const nonNullRefs = refs.filter(ref => ref !== null);
                    nonNullRefs.forEach(ref => {
                        notLoadedYet[ref.src] = true;
                    });
                    nonNullRefs.forEach(ref =>{
                        const script = document.createElement('script');
                        script.src = ref.src;
                        script.async = false;
                        script.onload = () =>{
                            //delete notLoadedYet[script.src];
                            Object.keys(notLoadedYet).forEach(key =>{
                                if(script.src.endsWith(key)){
                                    delete notLoadedYet[key];
                                    return;
                                }
                            })
                            if(Object.keys(notLoadedYet).length === 0){
                                resolve();
                            }
                        }
                        document.head.appendChild(script);
                    });
                })
 
            }
            connectedCallback(){
                super.connectedCallback();
                if(typeof(JSONEditor) !== 'function'){
                    if(!this.jsLibPath){
                        if(cs){
                            this.jsLibPath = this.absolute(cs.src, 'jsoneditor-minimalist.min.js');
                        }else{
                            throw "Not implemented yet"
                        }
                        
                    }
                    const refs = [{src: this.jsLibPath}] as IDynamicJSLoadStep[];
                    this.downloadJSFilesInParallelButLoadInSequence(refs).then(() =>{
                        this.loadedJS();
                    })
                }
                if(!this.cssPath){
                    //const cs = document.currentScript;
                    if(cs){
                        this.cssPath = this.absolute(cs.src, 'jsoneditor.min.css');
                    }else{
                        this.cssPath = '/bower_components/xtal-json-editor/jsoneditor.min.css';
                    }
                }
                //console.log(this.cssPath);
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
                     * Path to the js lib
                     */
                    jsLibPath:{
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
            static get template(){
                return `
<link id="extCss" on-load="loadedCSS" async rel="stylesheet" type="text/css"  href="[[cssPath]]">
<div id="xcontainer" style$="height:[[height]];width:[[width]]"></div>
                `
            }
            get jsonEditor() {
                return this._jsonEditor;
            }
            loadedCSS(){
                this._cssLoaded = true;
                this.onPropsChange();
            }
            loadedJS(){
                this._jsLoaded = true;
                this.onPropsChange();
            }
            onPropsChange() {
                if (!this.watch) return;
                if(this.waitForOptions && !this.options) return;
                if(!this._cssLoaded) return;
                if(!this._jsLoaded) return;
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
    cs = document.currentScript;
    function WaitForPolymer()
    {
        
        if ((typeof Polymer !== 'function') || (typeof Polymer.Element !== 'function')) {
           setTimeout( WaitForPolymer, 100);
           return;
        }
        initXtalJsonEditor();
    }
    WaitForPolymer();
})();