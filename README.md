[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-json-editor)

<a href="https://nodei.co/npm/xtal-json-editor/"><img src="https://nodei.co/npm/xtal-json-editor.png"></a>

# \<xtal-json-editor\>

Vanilla web component wrapper around josdejong's awesome, most excellent JSON Editor api, which can be found at  https://github.com/josdejong/jsoneditor

Although the web component does not depend on Polymer, it can work with its binding.  The output of the editor can either be text, or JSON, as specified by the as attribute:  

```html
    <div>Input:</div>
    <xtal-json-editor id="firstEditor" options="{}" as="json"></xtal-json-editor>
    <p-d on="edited-result-changed" to="xtal-json-editor{input}"></p-d>
    <div>Output:</div>
    <xtal-json-editor options="{}"></xtal-json-editor>
```

The markup above is using the [pass down element (p-d)](https://www.webcomponents.org/element/p-d.p-u) to bind the two instances together, but you can also use Polymer or custom event handling.

<!--
```
<custom-element-demo>
  <template>
  <div>
  <div data-pd>
    <pass-down></pass-down>
    <h3>Basic xtal-json-editor demo</h3>
    <p>Instructions:  Edit the object below and see the values reflected the second JSON Editor (which will appear after making an edit)</p>
    <xtal-insert-json input="{}"
      data-on="merged-prop-changed: pass-to-next:{input:target.value}"
    >
      <script type="application/json">
        [{
          "data": [
            {"name": "Harry Potter", "age":"13"},
            {"name": "Albus Dumbledore", "age":"279"}
          ],
          "columns":[
              {"id": "index",       "name": "Index",      "field": "index"},
              {"id": "isActive",    "name": "Active",     "field": "isActive"},
              {"id": "balance",     "name": "Balance",    "field": "balance"},
              {"id": "age",         "name": "Age",        "field": "age"},
              {"id": "eyeColor",    "name": "Eye Color",  "field": "eyeColor"},
              {"id": "name",        "name": "Name",       "field": "name"},
              {"id": "gender",      "name": "Gender",     "field": "gender"},
              {"id": "company",     "name":"Company",     "field": "company"}
          ],
          "gridOptions":{
              "enableCellNavigation": true,
              "enableColumnReorder": false
          }
        }]
      </script>
    </xtal-insert-json>

    <xtal-json-editor options="{}" as="json"
      data-on="edited-result-changed: pass-to:xtal-json-editor{input:target.value}{1}"
    ></xtal-json-editor>

    <div>Edited:</div>
    <xtal-json-editor options="{}" as="json"></xtal-json-editor>
    <script src="../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/pass-down@0.0.10/pass-down.iife.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/xtal-json-merge@0.2.32/json-merge.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/xtal-json-editor@0.0.31/xtal-json-editor.iife.js"></script>
  </div>
  </template>
</custom-element-demo>
```
-->

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

WIP
