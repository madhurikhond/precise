export const ckeConfig = {
  allowedContent: false,
  forcePasteAsPlainText: true,
  removePlugins:
    'elementspath,blockquote,preview,save,print,newpage,templates,find,replace,SpellChecker,scayt,flash,smiley,about',
  removeButtons:
    'Checkbox,Radio,Form,TextField,Textarea,Select,Button,ImageButton,HiddenField,PageBreak,SpecialChar,HorizontalRule,SpellChecker, Scayt',
  contentsCss: '../../assets/css/customCKEStyles.css',
  font_names:
  'Arial/Arial, Helvetica, sans-serif;' +
  'Comic Sans MS/Comic Sans MS, cursive;' +
  'Courier New/Courier New, Courier, monospace;' +
  'Georgia/Georgia, serif;' +
  'Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;' +
  'Tahoma/Tahoma, Geneva, sans-serif;' +
  'Times New Roman/Times New Roman, Times, serif;' +
  'Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;' +
  'Verdana/Verdana, Geneva, sans-serif;' +
  'Code128',
};



export class CkeEvent{

  public getQRCodeString(input: string): string {
    var output = null;
    try {
      let text = input.split('*');
      if (text.length == 3) {
        let data = text[1];
        if (data.search("<") == -1) {
          text[1] = "<img alt='Barcode : " + data + "' src='" + this.textWiseQR(data) + "' />";
          output = text.join('');
        }
      }
  
      let text1 = (output == null ? input : output).split('<span style="font-family:Code128">');
      if (text1.length == 2) {
        let data = text1[1].split('</span>');
        if (data.length > 1) {
          data[0] = "<img alt='Barcode : " + data[0] + "' src='" + this.textWiseQR(data[0]) + "' />";
          text1[1] = data.join('');
          output = text1.join('');
        }
      }
    } catch (error) {
      output = error.message;
    }
    return output;
  }
  
  private textWiseQR(text: string): string {
    let fileData = "https://barcode.tec-it.com/barcode.ashx?data=" + text + "&code=Code128&multiplebarcodes=true&translate-esc=true";
    let source = fileData;
    // let source = 'data:image/png;base64,' + fileData;
    return source;
  }
  
}

