//@ts-check
const jiife = require('jiife');
const xl = 'node_modules/xtal-latx/';
jiife.processFiles([xl + 'define.js', xl + 'xtal-latx.js','xtal-json-editor.js'], 'xtal-json-editor.iife.js');




