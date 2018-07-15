(function(){const disabled="disabled";function XtallatX(superClass){return class extends superClass{constructor(){super(...arguments);this._evCount={}}static get observedAttributes(){return[disabled]}get disabled(){return this._disabled}set disabled(val){this.attr(disabled,val,"")}attr(name,val,trueVal){if(val){this.setAttribute(name,trueVal||val)}else{this.removeAttribute(name)}}incAttr(name){const ec=this._evCount;if(name in ec){ec[name]++}else{ec[name]=0}this.attr(name,ec[name].toString())}attributeChangedCallback(name,oldVal,newVal){switch(name){case disabled:this._disabled=null!==newVal;break;}}de(name,detail){const eventName=name+"-changed",newEvent=new CustomEvent(eventName,{detail:detail,bubbles:!0,composed:!1});this.dispatchEvent(newEvent);this.incAttr(eventName);return newEvent}_upgradeProperties(props){props.forEach(prop=>{if(this.hasOwnProperty(prop)){let value=this[prop];delete this[prop];this[prop]=value}})}}}let cs_src;const preloadLink=self.xtal_json_editor;if(preloadLink){cs_src=preloadLink.href}else{const cs=document.currentScript;if(cs){cs_src=cs.src}else{cs_src="https://unpkg.com/xtal-json-editor/xtal-json-editor.esm.js"}}const base=cs_src.split("/").slice(0,-1).join("/"),input="input",options="options",as="as",template=document.createElement("template");let css;fetch(base+"/jsoneditor.min.css",{credentials:"same-origin"}).then(resp=>{resp.text().then(content=>{const searchStr="img/jsoneditor-icons.svg";css=replaceAll(content,searchStr,base+"/"+searchStr);checkIfReady()})});let jsLoaded=!1;const scriptTag=document.createElement("script");scriptTag.src=base+"/jsoneditor-minimalist.min.js";scriptTag.onload=()=>{jsLoaded=!0;checkIfReady()};document.head.appendChild(scriptTag);function replaceAll(str,search,replace){return str.split(search).join(replace)}function checkIfReady(){if(jsLoaded&&css){template.innerHTML=`
            <style>
            :host {
                display: block;
            }
            ${css}
            </style>
            <div id="xcontainer" style="height:100%;width:100%"></div>            
            `;init()}}class XtalJsonEditor extends XtallatX(HTMLElement){constructor(){super();this._as="text";this._connected=!1;this.attachShadow({mode:"open"});this.shadowRoot.appendChild(template.content.cloneNode(!0))}static get is(){return"xtal-json-editor"}get input(){return this._input}set input(val){this._input=val;this.onPropsChange()}get options(){return this._options}set options(val){this._options=val;this.onPropsChange()}get editedResult(){return this._editedResult}set editedResult(val){this._editedResult=val;this.value=val;this.de("edited-result",{value:val})}get as(){return this._as}set as(val){this.attr(as,val)}static get observedAttributes(){return super.observedAttributes.concat([input,options,as])}attributeChangedCallback(name,oldVal,newVal){switch(name){case input:case options:this[name]=JSON.parse(newVal);break;case as:this._as=newVal;break;}}connectedCallback(){this._connected=!0;this._upgradeProperties([input,options,as]);this.onPropsChange()}onPropsChange(){if(!this._connected||!this._input||!this._options)return;if(!this._options.onChange){this.options.onChange=()=>{let result=this._jsonEditor.get();if("text"===this.as)result=JSON.stringify(result);this.editedResult=result}}const container=this.shadowRoot.querySelector("#xcontainer");container.innerHTML="";this._jsonEditor=new JSONEditor(container,this.options);this._jsonEditor.set(this._input)}}function init(){if(!customElements.get(XtalJsonEditor.is)){customElements.define(XtalJsonEditor.is,XtalJsonEditor)}}})();