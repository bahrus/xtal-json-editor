[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-json-editor)

# \<xtal-json-editor\>

Polymer web wrapper around josdejong&#39;s awesome, most excellent JSON Editor api, which can be found at  https://github.com/josdejong/jsoneditor

<!--
```
<custom-element-demo>
  <template>
    <link rel="import" href="xtal-json-editor.html">
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

Important note regarding stylesheet dependency.

This component includes the default css file for the json editor:  jsoneditor.min.css.  You can override this default, for your own look and feel by setting:

```html
    <xtal-json-editor cssPath="...">
```

This path will be relative to the hosting page url, not the component.  We are basing the default path based on document.currentScript.  But IE11 doesn't support that, so it is guessing that the path starts from /bower_components.  If you are seeing an incorrect url path in your particular environment, please try setting the cssPath directly as shown above. 

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
