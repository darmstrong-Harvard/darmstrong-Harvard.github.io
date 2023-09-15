import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.6.1/all/lit-all.min.js';

export class MyTable extends LitElement {
  static getMetaConfig() {
    // Use the PluginProperty type to define custom properties for your plugin
const customProp: PluginProperty = {
  type: 'string',
  title: 'APWF Coding Slip',
  description: 'This is a custom property',
};
// Use the PluginContract type to define the contract for your Nintex Form plugin
const plugin: PluginContract = {
  version: '1.0',
  fallbackDisableSubmit: false,
  controlName: 'APWF Coding Slip',
  };
  }
  
  static properties = {
    dataobject: '',
  }

  constructor() {
    super();
  }

  parseDataObject() {
    let data = JSON.parse(this.dataobject);
    const unicodeRegex = /_x([0-9A-F]{4})_/g;
    data = JSON.parse(JSON.stringify(data).replace(unicodeRegex, (match, p1) => String.fromCharCode(parseInt(p1, 16))));
    return data;
  }


  parseXmlDataObject() {
    let xmlString = this.dataobject.replace(/&quot;/g, '"').replace(/_x([\dA-F]{4})_/gi, (match, p1) => String.fromCharCode(parseInt(p1, 16)));
  
    // Remove XML declaration if present
    xmlString = xmlString.replace(/<\?xml.*?\?>/, '');
  
    const parser = new DOMParser();
    const xmlDocument = parser.parseFromString(xmlString, 'text/xml');
    const items = xmlDocument.querySelector('RepeaterData > Items').children;
    const data = [];
  
    for (let i = 0; i < items.length; i++) {
      const row = {};
      const fields = items[i].children;
  
      for (let j = 0; j < fields.length; j++) {
        const field = fields[j];
        const fieldName = field.nodeName;
        let fieldValue = field.textContent;
        fieldValue = fieldValue.replace(/_x([\dA-F]{4})_/gi, (match, p1) => String.fromCharCode(parseInt(p1, 16)));
  
        row[fieldName] = fieldValue;
      }
  
      data.push(row);
    }
  
    return data;
  }
  
  render() {
    let data;

    try {
      data = this.parseDataObject();
    } catch (e) {
      // If parsing as JSON fails, assume it's XML
      console.log("XML detected");
      try {
        data = this.parseXmlDataObject();
        console.log('XML converted to JSON:', data);
      } catch (e) {
        console.error(e);
        return html`
          <p>Failed to parse dataobject</p>
        `;
      }
    }

    if (!data || data.length === 0) {
      return html`
        <p>No Data Found</p>
      `;
    }
	
	// Define the desired order of fields in the main row
	const fieldOrder = ["ITEM", "REF", "ENTITYID", "ACCTNUM", "ITEMAMT", "CURRCODE", "BANKID"];
	
    let table = '<table>';
  table += '<thead><tr>';

  // Create table headers based on the specified field order
  for (const field of fieldOrder) {
    table += `<th>${field}</th>`;
  }

  table += '</tr></thead><tbody>';

  // Loop through the array and create table rows and cells
  for (const item of data) {
    table += '<tr>';
    for (const field of fieldOrder) {
      table += `<td>${item[field]}</td>`;
    }
    table += '</tr>';

    // Create a subrow for "PONUM" and "POQTY"
    table += '<tr class="subrow">';
    table += `<td colspan="${fieldOrder.length}">PONUM: ${item.PONUM || ''}, POQTY: ${item.POQTY || ''}</td>`;
    table += '</tr>';
  }

  table += '</tbody></table>';

    return table;
  }
}

customElements.define('APWF-table-viewer', MyTable);