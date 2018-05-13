declare var JSONEditor;
declare var xtal_json_editor;
export interface  IXtalJsonEditorProperties{
    input: object;
    options: any;
    editedResult: object;
    as: string;
}
(function () {
    interface IDynamicJSLoadStep {
        src?: string;
    }
    const cs_src = self['xtal_json_editor'] ? xtal_json_editor.href : (document.currentScript as HTMLScriptElement).src;
    const base = cs_src.split('/').slice(0, -1).join('/');
    const input = 'input';
    const options = 'options';
    const as = 'as';
    const template = document.createElement('template');
    let css: string;
    fetch(base + '/jsoneditor.min.css', {
        credentials: 'include'
    }).then(resp =>{
        resp.text().then(content =>{
            css = content;
            checkIfReady();
        })
    });
    let jsLoaded = false;
    const scriptTag = document.createElement('script');
    scriptTag.src = base + '/jsoneditor-minimalist.min.js';
    scriptTag.onload = (e =>{
        jsLoaded = true;
        checkIfReady();
    })
    document.head.appendChild(scriptTag);
    function checkIfReady(){
        if(jsLoaded && css){
            template.innerHTML = `
            <style>
            :host {
                display: block;
            }
            ${css}
            </style>
            <div id="xcontainer" style="height:100%;width:100%"></div>            
            `;
            initXtalJsonEditor();
        }
    }

    function initXtalJsonEditor(){
        
        class XtalJsonEditor extends HTMLElement implements IXtalJsonEditorProperties{
            static get is(){return 'xtal-json-editor';}
            constructor(){
                super();
                this.attachShadow({ mode: 'open' });
                this.shadowRoot.appendChild(template.content.cloneNode(true));
            }
            /************ Properties *****************/
            _input: object;
            get input(){
                return this._input;
            }
            set input(val){
                this._input = val;
                this.onPropsChange();
            }
    
            _options: object;
            get options(){
                return this._options;
            }
    
            set options(val){
                this._options = val;
                this.onPropsChange();
            }
    
            _editedResult: object;
            get editedResult(){
                return this._editedResult;
            }
    
            set editedResult(val: object){
                this._editedResult = val;
                const editedResultChangedEvent = new CustomEvent('edited-result-changed', {
                    detail:{
                        value: val
                    },
                    bubbles: true,
                    composed: false,
                } as CustomEventInit);
                this.dispatchEvent(editedResultChangedEvent);
            }
            /***********End Properties ************/
            /***************** Attributes  */
            _as = 'text';
            get as(){
                return this._as;
            }
            set as(val){
                this.setAttribute(as, val)
            }
            static get observedAttributes(){
                return [input, options, as];
            }
            _upgradeProperties(props: string[]) {
                props.forEach(prop =>{
                    if (this.hasOwnProperty(prop)) {
                        let value = this[prop];
                        delete this[prop];
                        this[prop] = value;
                    }
                })

            }
            attributeChangedCallback(name: string, oldVal: string, newVal: string){
                switch(name){
                    case input:
                    case options:
                        this[name] = JSON.parse(newVal);
                        break;
                    case as:
                        this._as = newVal;
                        break;
                }
            }
    
            _connected = false;
            connectedCallback(){
                this._connected = true;
                this._upgradeProperties([input, options, as])
                this.onPropsChange();
            }
            _jsonEditor: any;
            onPropsChange(){
                if(!this._connected || !this._input || !this._options) return;
                if(!this._options['onChange']){
                    this.options['onChange'] = () =>{
                        let result = this._jsonEditor.get();
                        if(this.as === 'text') result = JSON.stringify(result);
                        this['_setEditedResult'](result);
                    }
                }
                //}
                const container = this.shadowRoot.querySelector('#xcontainer');
                container.innerHTML = '';
                this._jsonEditor = new JSONEditor(container, this.options);
                this._jsonEditor.set(this._input);
            }
        }

        if(!customElements.get(XtalJsonEditor.is)){
            customElements.define(XtalJsonEditor.is, XtalJsonEditor);
        }
    }

})();