///<reference path="polymer2.d.ts"/>
/// <reference types="jsoneditor" />
var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        customElements.whenDefined('dom-module').then(() => {
            /**
             * Polymer based web component wrapper around the awesome, most excellent JSON Editor api, which can be found at  at https://github.com/josdejong/jsoneditor
             *
             * @customElement
             * @polymer
             * @demo demo/index.html
             */
            class XtalJsonEditor extends Polymer.Element {
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
        });
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-json-editor.js.map