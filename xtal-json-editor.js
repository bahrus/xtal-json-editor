///<reference path="node_modules/@types/jsoneditor/index.d.ts"/>
//declare type JSONEditor = jsoneditor.JSONEditor;
(function () {
    function initXtalJsonEditor() {
        console.log('in initXtalJsonEditor');
        if (customElements.get('xtal-json-editor')) {
            console.log('already defined');
            return;
        }
        console.log('lets define xtal-json-editor');
        /**
        * Polymer based web component wrapper around the awesome, most excellent JSON Editor api, which can be found at https://github.com/josdejong/jsoneditor
        *
        * @customElement
        * @polymer
        * @demo demo/index.html
        */
        class XtalJsonEditor extends Polymer.Element {
            constructor() {
                super();
                console.log('in construcrtor');
            }
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
                    waitForOptions: {
                        type: Boolean,
                        observer: 'onPropsChange'
                    },
                    /**
                     * Expression for where to place the results of the edited json
                     */
                    editedResult: {
                        type: Object,
                        notify: true,
                        readOnly: true
                    },
                    /**
                     * Specify format for results:  text or json
                     */
                    as: {
                        type: String,
                        value: 'text'
                    },
                    height: {
                        type: String,
                        value: '400px'
                    },
                    width: {
                        type: String,
                        value: '400px'
                    }
                };
            }
            get jsonEditor() {
                return this._jsonEditor;
            }
            onPropsChange(newVal) {
                console.log('onPropsChange');
                if (!this.watch)
                    return;
                if (this.waitForOptions && !this.options)
                    return;
                //const _this = this;
                if (!this.options)
                    this.options = {};
                //if(this.options){
                if (!this.options.onChange) {
                    this.options.onChange = () => {
                        let result = this._jsonEditor.get();
                        if (this.as === 'text')
                            result = JSON.stringify(result);
                        this['_setEditedResult'](result);
                    };
                }
                //}
                this.$.xcontainer.innerHTML = '';
                console.log('i am here');
                this._jsonEditor = new JSONEditor(this.$.xcontainer, this.options);
                this._jsonEditor.set(this.watch);
            }
        }
        console.log('adding XtalJsonEditor to custom elements');
        customElements.define(XtalJsonEditor.is, XtalJsonEditor);
    }
    function WaitForPolymer() {
        if ((typeof Polymer !== 'function') || (typeof Polymer.Element !== 'function')) {
            setTimeout(WaitForPolymer, 100);
            return;
        }
        console.log('call initXtalJsonEditor');
        initXtalJsonEditor();
    }
    console.log('call WaitForPolymer');
    WaitForPolymer();
})();
//# sourceMappingURL=xtal-json-editor.js.map