export const ckeConfig = {
  allowedContent: false,
  forcePasteAsPlainText: true,
  extraAllowedContent: {
    span: {classes: 'ss'}
  },
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
      let text1 = (output == null ? input : output).split('<span style="font-family:Code128">');
      if (text1.length == 2) {
        let data = text1[1].split('</span>');
        if (data.length > 1) {
          data[0] = "<span class='ss'>"+this.textWiseQR(data[0])+"</span>";
          text1[1] = data.join('');
          output = text1.join('');
        }
      }
    } catch (error) {
      output = null;
    }
    return output;
  }
  
  private textWiseQR(text: string): string {
  text = '*'+text+'*';
  var x = text;
  
  var i, j, intWeight, intLength, intWtProd = 0, arrayData = [], fs,chrString;
  var arraySubst = [ "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê" ];

  intLength = x.length;
	arrayData[0] = 104; 
	intWtProd = 104;
	for (j = 0; j < intLength; j += 1) {
			arrayData[j + 1] = x.charCodeAt(j) - 32; 
			intWeight = j + 1; 
			intWtProd += intWeight * arrayData[j + 1]; 
	}
	arrayData[j + 1] = intWtProd % 103; 
	arrayData[j + 2] = 106; 
  var chr = parseInt(arrayData[j + 1], 10); 
  if (chr > 94) {
    chrString = arraySubst[chr - 95];
  } else {
    chrString = String.fromCharCode(chr + 32);
  }
  var source = 'Ì' + x + chrString + 'Î'; 
  return source;
  }
  
}

