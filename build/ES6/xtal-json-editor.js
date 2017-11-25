(function(){function a(){if(!customElements.get("xtal-json-editor")){class a extends Polymer.Element{constructor(){super(...arguments),this.cs=c}absolute(a,b){var c=a.split("/"),d=b.split("/");c.pop();for(var e=0;e<d.length;e++)"."!=d[e]&&(".."==d[e]?c.pop():c.push(d[e]));return c.join("/")}downloadJSFilesInParallelButLoadInSequence(a){return new Promise((b)=>{const c={},d=a.filter((a)=>null!==a);d.forEach((a)=>{c[a.src]=!0}),d.forEach((a)=>{const d=document.createElement("script");d.src=a.src,d.async=!1,d.onload=()=>{Object.keys(c).forEach((a)=>{if(d.src.endsWith(a))return void delete c[a]}),0===Object.keys(c).length&&b()},document.head.appendChild(d)})})}connectedCallback(){if(super.connectedCallback(),"function"!==typeof JSONEditor){if(!this.jsLibPath)if(c)this.jsLibPath=this.absolute(c.src,"jsoneditor-minimalist.min.js");else throw"Not implemented yet";const a=[{src:this.jsLibPath}];this.downloadJSFilesInParallelButLoadInSequence(a).then(()=>{this.loadedJS()})}this.cssPath||(c?this.cssPath=this.absolute(c.src,"jsoneditor.min.css"):this.cssPath="/bower_components/xtal-json-editor/jsoneditor.min.css")}static get is(){return"xtal-json-editor"}static get properties(){return{cssPath:{type:String},jsLibPath:{type:String},watch:{type:Object,observer:"onPropsChange"},options:{type:Object,observer:"onPropsChange"},waitForOptions:{type:Boolean,observer:"onPropsChange"},editedResult:{type:Object,notify:!0,readOnly:!0},as:{type:String,value:"text"},height:{type:String,value:"400px"},width:{type:String,value:"400px"}}}static get template(){return`
<link id="extCss" on-load="loadedCSS" async rel="stylesheet" type="text/css"  href="[[cssPath]]">
<div id="xcontainer" style$="height:[[height]];width:[[width]]"></div>
                `}get jsonEditor(){return this._jsonEditor}loadedCSS(){this._cssLoaded=!0,this.onPropsChange()}loadedJS(){this._jsLoaded=!0,this.onPropsChange()}onPropsChange(){this.watch&&(!this.waitForOptions||this.options)&&this._cssLoaded&&this._jsLoaded&&(!this.options&&(this.options={}),!this.options.onChange&&(this.options.onChange=()=>{let a=this._jsonEditor.get();"text"===this.as&&(a=JSON.stringify(a)),this._setEditedResult(a)}),this.$.xcontainer.innerHTML="",this._jsonEditor=new JSONEditor(this.$.xcontainer,this.options),this._jsonEditor.set(this.watch))}}customElements.define(a.is,a)}}function b(){return"function"!==typeof Polymer||"function"!==typeof Polymer.Element?void setTimeout(b,100):void a()}let c;c=document.currentScript,b()})();