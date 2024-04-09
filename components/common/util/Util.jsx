
import Swal from "sweetalert2";

export const customAlert = (error) => {
  let error_code = error.response.data.code;		// 에러코드
  let error_msg = error.response.data.message;		// 에레메시지
  Swal.fire({
    icon: "error",
    //title: "경고",
    text: error_msg,
  });  

  return false;
}

/**
 * 날짜
 * @param {*} objText 
 */
function uf_formatDT(objText) {

	if (objText == "-") {
		return objText;
	}

	if (objText.length != 8) {
		return objText;
	}
	return objText.substr(0, 4) + "-" + objText.substr(4, 2) + "-" + objText.substr(6, 2);
}


/**
 * 날짜(년월)
 * @param {*} objText 
 */
function uf_formatYm(objText) {
	if (objText == "-") {
		return objText;
	}

	if (objText.length != 6) {
		return objText;
	}
	return objText.substr(0, 4) + "-" + objText.substr(4, 2);
}

/**
 * 날짜 (년월일)
 * @param {*} objText 
 */
function uf_formatHanDT(objText) {

	if (objText == "-") {
		return objText;
	}

	if (objText.length != 8) {
		return objText;
	}
	return objText.substr(0, 4) + "년 " + objText.substr(4, 2) + "월 " + objText.substr(6, 2) + "일";
}

/**
 * 날짜 (년월)
 * @param {*} objText 
 */
 function uf_formatHanYM(objText) {

	if (objText == "-") {
		return objText;
	}

	if (objText.length != 6) {
		return objText;
	}
	return objText.substr(0, 4) + "년 " + objText.substr(4, 2) + "월 ";
}

/**
 * 숫자 천당 , 넣기
 * @param {*} objText 
 */
function uf_formatNum(objText) {
	if (!objText) {
		return 0;
	} else {
		return objText.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
}

/**
 * 숫자 천당 , 넣기 (없다고 0을 return 하지 않음)
 * @param {*} objText 
 */
function uf_formatNumNoZero(objText) {
	if (!objText) {
		return '';
	} else {
		return objText.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
}

/**
 * 사업자번호
 * @param {*} objText 
 */
function uf_formatBizNo(objText) {
	let text = objText;
	if(objText) {
		text = text.replace(/[^0-9]/gi, "");
		if(text.length === 10) {
			return text.substr(0, 3) + "-" + text.substr(3, 2) + "-" + text.substr(5);
		}
		return objText;
	}
}

/**
 * 전화번호
 * @param {*} objText 
 * @returns 
 */
function uf_formatHP(objText) {

	var formatText = "";
	switch (objText.length) {
		case 8:
			formatText = objText.substr(0, 4) + "-" + objText.substr(4, 4);
			break;
		case 9:
			formatText = objText.substr(0, 2) + "-" + objText.substr(2, 3) + "-" + objText.substr(5, 4);
			break;
		case 10:
			if (objText.substr(0, 2) == '02') {
				formatText = objText.substr(0, 2) + "-" + objText.substr(2, 4) + "-" + objText.substr(6, 4);
			} else {
				formatText = objText.substr(0, 3) + "-" + objText.substr(3, 3) + "-" + objText.substr(6, 4);
			}
			break;
		case 11:
			formatText = objText.substr(0, 3) + "-" + objText.substr(3, 4) + "-" + objText.substr(7, 4);
			break;
		default:
			formatText = objText;
			break;
	}

	return formatText;
}

/**
* 포맷 지정 함수
* @param {*} type 
* @param {*} val 
* @returns 
*/
export const uf_formatChange = function(type, val) {	  
  if (parseInt(val) != 'NaN' && val != null && val != undefined) {

    switch (type) {
      case 'date':
        val = uf_formatDT(val);				
        break;
      case 'dateYm':
        val = uf_formatYm(val);				
        break;
      case 'dateHan':
        val = uf_formatHanDT(val);				
        break;
      case 'dateHanYM' :
        val = uf_formatHanYM(val);
        break;			
      case 'num':
        val = uf_formatNum(val);
        break;
      case 'numNoZero':
        val = uf_formatNumNoZero(val);
        break;
      case 'nobiz':        
        if (val.length == 10) {
          val = uf_formatBizNo(val);
          //console.log(val);
        } else if (val.length == 13) {					
          val = val.substring(0, 6) + '-' + val.substring(6);
        }
        break;
      case 'tel':
        val = uf_formatHP(val);
      break;
        default:
        break;
    }
  }
  return val;
}

/**
 * param 생성
 * @param {*} inputs 
 * @returns 
 */
export const uf_makeParams = function(inputs){
	let params = {};
	//let inputs = search.getElementsByTagName('input');  
	for (const input of inputs) {
		if( input.type === 'text' || input.type === 'hidden' || input.type === 'select-one' ) {
      if( input.name === 'NO_BIZ' || input.name.includes('DT') || input.name.includes('HP') ) {
        params[input.name] = input.value.replace(/-/gi, '');  
      } else {
        params[input.name] = input.value;
      }      
    } else if( input.type === 'date' ) {
      params[input.name] = input.value.replace(/-/gi, '');
		} else if( input.type === 'number' ) {
			params[input.name] = uf_onlyNumber(input.value);
		} else if( input.type === 'radio' ) {
			if( input.checked === true ){
				params[input.name] = input.value;
			}
    } else if( input.type === 'textarea' ) {			
      params[input.name] = input.value;			
    }

	}
	
	return params;
}

export const uf_onlyNumber = function(string) {	
	
  const check = /[^0-9]/g; // 숫자가 아닌 문자열을 선택하는 정규식
  string = string.replace(check, ""); // 원래 문자열에서 숫자가 아닌 모든 문자열을 빈 문자로 변경
	console.log("string : ", string);
  return string;
};



/**
 * 숫자 입력 (마이너스, 소수점, 콤마) 
 * @param {*} val 값
 * @param {*} isMinus true of false
 * @param {*} isFloat true of false
 * @param {*} isComma true of false
 * @returns 숫자
 */
export const uf_numberFormat = function(val, isMinus, isFloat, isComma){
  var str = val;
  //일단 마이너스, 소수점을 제외한 문자열 모두 제거
  str = str.replace(/[^-\.0-9]/g, '');
  //마이너스
  if(isMinus){
     str = uf_chgMinusFormat(str);   
  } else {
     str = str.replace('-','');
  }
  
  //소수점
  if(isFloat){
     str = uf_chgFloatFormat(str);       
  } else {
     if(!isMinus ){
        str = str.replace('-','');
     }
     str = str.replace('.','');
     if(str.length>1){
        str = Math.floor(str);
        str = String(str);
     }
  }
  
  //콤마처리
  if(isComma){
     var parts = str.toString().split('.');
     if(str.substring(str.length - 1, str.length)=='.'){
        str = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,",") +".";
     } else {
        str = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,",") + (parts[1] ? "." + parts[1] : "");
     }
  }

  return str;
}

export const uf_chgFloatFormat = function(str){
  var idx = str.indexOf('.');  
  if(idx<0){  
     return str;
  } else if(idx>0){
     var tmpStr = str.substr(idx+1);    
     if(tmpStr.length>1){             
        if(tmpStr.indexOf('.')>=0){        
           tmpStr =  tmpStr.replace(/[^\d]+/g, '');                  
           str = str.substr(0,idx+1) + tmpStr;
        }
     }    
  } else if(idx==0){
        str = '0'+str;
  }
  return str;  
}
  
export const uf_chgMinusFormat = function(str){
  var idx = str.indexOf('-');
  if(idx==0){
  var tmpStr = str.substr(idx+1);
     //뒤에 마이너스가 또 있는지 확인
     if(tmpStr.indexOf('-')>=0){
           tmpStr = tmpStr.replace('-','');
        str = str.substr(0,idx+1) + tmpStr;  
     }
  } else if(idx>0){
        str = str.replace('-','');
  } else if(idx<0){
        return str;
  }
     return str;
}


export const uf_isNull = function(v)  {
  return ( isEmpty(v) ) ? true : false;
}

/**
 * 데이터가 비었는지 체크
 * @param {*} value 
 * @returns true: null, false: 데이터 있음
 */
const isEmpty = (value) => {
  if ( typeof value == "undefined"
      || value == null
      || value === ""
      || value === "null"
      || (value != null && typeof value === "object" && !Object.keys(value).length)
      || (value != null && Array.isArray(value) && value.length === 0)) {
    return true;
  } else {
    return false;
  }
};

/**
 * array를 동일한 key-value object 로 변환
 * @param {*} obj array
 * @param {*} strKeyNm key로 지정할 문자열
 * @returns object
 */
export const uf_convertArrToObj = function(obj, strKeyNm) {
	let selRow = {};
	let object = [];
	let keyNm = strKeyNm;
	for (const row of obj) {      
		selRow = {[keyNm]: row};      
		object.push(selRow);
	}   

	return object;
}

/**
 * 문자열 치환
 * @param {*} obj array
 * @param {*} strKeyNm key로 지정할 문자열
 * @returns object
 */
export const uf_numRepl = function(val, strType) {
	let value = val;
	let type = strType;
	let result = '';
  if( type === 'NUM' ) {
    result = Number(value.replace(',', ''));
  }

	return result;
}

/**
 * 변수가 null일때 빈문자열로 return
 * @param {*} str : 문자열
 * @returns str
 */
export const uf_nullToStr = function(str) {
  try {
    if (str === null || str === '' || str === undefined) {
      if( str === 0 ) {
        return str;
      }
      return '';
    } else {
      return str;
    }

  } catch (e) {
    logger.error('nullToStr', e);
    return str;
  }
};

/**
 * FormData에 파일을 추가
 * @param {FormData} formData 
 * @param {string} name 
 * @param {FileList} fileList 
 */
export const uf_appendFileToFormData = (formData, name, fileList) => {  
  for(let f of fileList){
    formData.append(name, f);
  }      
}

/**
 * 필드가 있는지 체크
 * @param {*} fieldList 배열
 * @param {*} targetObj 객체
 * @returns true of false
 */
export const uf_mandatoryFields = (obj, fieldList) => {
  let result = true;
  fieldList.forEach(fieldName => {
    if (result)
      result = result && (findProp(obj, fieldName) != null);
  });
  return result;
}

/**
 * Case -insensitive Property Getter
 * param {Object} obj 대상 객체
 * param {string} targetKey 프로퍼티 이름
 * returns {null|*} 해당 프로퍼티 값
 */
const findProp = (obj, targetKey) => {
  const t = String(targetKey).toLowerCase();
  for (const objectKey in obj) {
    if (obj.hasOwnProperty(objectKey)) {
      const o = String(objectKey).toLowerCase();
      if (o === t && !isEmpty(obj[objectKey]))
        return obj[objectKey];
    }
  }
  return null;
}

/**
 * hierarchy 구조로 변환하는 함수
 * @param {*} array 리스트 배열
 * @returns 
 */
export const uf_makeHierarchy = function(array) {
  let map = {};

  for (let i = 0; i < array.length; i++) {
    let obj = array[i];

    if (obj.SUB_MENU_CNT > 0) {
      obj._children = [];
      map[obj.SYS_MENU_SEQ] = obj;
    }

    let parent = obj.PRT_MENU_SEQ || 'data';

    if (!map[parent]) {
      map[parent] = {
        _children: []
      };
    }

    map[parent]._children.push(obj);
  }

  return map['data']._children;
}