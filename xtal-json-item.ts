import {createTemplate} from 'xtal-element/utils.js';

export const entityTemplate = createTemplate(/* html */`
<details>
    <summary>
        <button></button>
        <input type=text>
        <input type=text>
    </summary>
    
</details>
`);
export class XtalJsonItem extends HTMLElement{
    _obj: object;
    get obj(){
        return this._obj;
    }
    set obj(nv){
        this._obj = nv;
    }
}