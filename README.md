[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-json-editor)

# \<xtal-json-editor\>

Polymer web wrapper around josdejong&#39;s awesome, most excellent JSON Editor api, which can be found at  https://github.com/josdejong/jsoneditor

<!--
```
<custom-element-demo>
  <template>
    <link rel="import" href="xtal-json-editor-sync.html">
    <link rel="import" href="../polymer/lib/elements/dom-bind.html">
    <dom-bind>
        <template>
            <xtal-json-editor watch="[[objectToEdit]]"></xtal-json-editor>
            <br>
              Edited Value: 
              <code>[[myEditedResult]]</code>
            </template>
        </template>
    </dom-bind>
    <script>
        document.querySelector('dom-bind').objectToEdit = {
          hello: 'world'
        };
      </script>
  </template>
</custom-element-demo>
```
-->
```html
    <dom-bind>
        <template>
            <xtal-json-editor watch="[[objectToEdit]]"></xtal-json-editor>
        </template>
    </dom-bind>
```

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
