
import {html,css, LitElement} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
// define the component
export class LaketreeProgressbar extends LitElement {

  static styles = css` 
  
  .container {
    width: 100%;
    background-color: #ddd;
    border-radius:10px;    
  }
  
  .laketree-pbar {
    border-radius:10px;    
    text-align: right;
    background-color: var(--ntx-form-theme-color-primary);
    color: var(--ntx-form-theme-color-form-background);
  }
    
  `


  static properties = {
    value: {type: Number },
    showLabel: {type: Boolean },
  };

  static getMetaConfig() {
    return {
      controlName: 'Laketree Progressbar',
      iconUrl: "https://laketree.com/wp-content/themes/laketree/img/favicon/favicon-32x32.png",
      groupName : 'LakeTree',
      fallbackDisableSubmit: false,
      version: '1.2',
      standardProperties : {
        visiblity: true
      },
      properties: {
        value: {
          type: 'number',
          title: 'Value'
        },
        showLabel: {
          title: 'Show Label',
          type: 'boolean',
          defaultValue: true,
        },
      }
    };
  }


  constructor() {
    super();
  }

  render() {
    
    this._showLabel = this.showLabel ?? true;
    this._height = 10;
    this._displayValue = "";

    this._defaultValue = this.value;
    this._defaultValue = this._defaultValue ?? 0;      


    if (this._defaultValue == 0) {  
      this._showLabel = false;
    }

    if(this._showLabel) {
        this._displayValue = this._defaultValue + '%';
        this._height = 18;
      }


    return html`
    <style>

    .laketree-pbar {
      height:${this._height}px;          
    }

    </style>


    <div class="container">
      <div class="laketree-pbar" style="width:${this._defaultValue}%">${this._displayValue}</div>
    </div>

        `;
  }
}

const elementName = 'laketree-progressbar';
customElements.define(elementName, LaketreeProgressbar);