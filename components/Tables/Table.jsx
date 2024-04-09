import React, { useEffect, useState, useMemo } from 'react';
import Util from '@/components/common/util/Util';
import { uf_formatChange, uf_isNull } from '@/components/common/util/Util';
import Link from 'next/link';
import CheckBox from '@/components/Checkboxes/Checkbox';

export default function Table({
  type = 'list',
  headers,
  items = [],
  selectCheck = false,
  itemKey = [],
  tdColor = false,
  updateSelection = () => {},
}) {
  
  if (!headers || !headers.length) {
    throw new Error('<Table /> headers is required.');
  }

  // hidden을 뺀 header의 갯수
  const headerCnt = useMemo(()=>{
    return headers.filter((header) => header.hidden !== true ).length;
  },[headers]);

  const headerKey = headers.map((header) => header.value);
  
  // itemKey가 없다면 headers의 첫번째 요소를 key로 지정
  if (!itemKey) {
    itemKey = headerKey[0];
  }    
  
  const [selection, setSelection] = useState(new Set());

  useEffect(() => {
    if( type === 'tree' ) {
      const chkVal = items.map((v) => v.SELECT_YN === 'Y' ? v.SYS_MENU_SEQ : null  );
      const uniqueArr = chkVal.filter((element, index) => {
        return element !== null;
      });
      setSelection(new Set(uniqueArr));
    }
  }, [items, itemKey])


  const onChangeSelect = (value) => {
    
    let newSelection = new Set(selection);
  
    if (newSelection.has(value)) {      
      newSelection.delete(value);
    } else {            
      newSelection.add(value);
    }
    
    setSelection(newSelection);
    updateSelection([...newSelection]);
  };

  
  const getAbledItems = (items) => {
    console.log("items : ", items);
    return items.filter(({ disabled }) => !disabled);
  };

  const onChangeSelectAll = (e) => {
    //console.log("table - onChangeSelectAll : ", e);
    if (e.target.checked) {      
      const allCheckedSelection = new Set(        
        getAbledItems(items).map((item) => item[itemKey])
      );
      setSelection(allCheckedSelection);
      updateSelection([...allCheckedSelection]);
    } else {      
      setSelection(new Set());
      updateSelection([]);
    }
  };
  

  const isSelectedAll = () => {
    return selection.size === getAbledItems(items).length;
  };  

  /**
   * 
   * @param {*} flag S: select, U: update, B: button
   * @param {*} data flag에 따라 배열 또는 단일 데이터
   */
  const funcSelect = (flag, data, strVal) => {  
    data['DIVISION'] = flag;    
    data['BTN_KEY'] = strVal;
    console.log("data : " , data);
    updateSelection([data]);
    
  }  

  const checkList = [...Array(5).fill("체크").map((v, i) => v + i)]

  const [ rowClick, setRowClick ] = useState(tdColor ? 0 : null);
  
  /**
   * 
   * @param {*} index td 행 index
   * @param {*} property 선택, 팝업 등
   * @param {*} item object
   * @param {*} tdColor false or true
   */
  const funcEventHandler = (index, property, item, tdColor) => {  
    if( tdColor ) {
      setRowClick(index);
      
      if( property.rowUpd ) {
        item['DIVISION'] = 'U';
      } else if( property.rowSelect ) {
        item['DIVISION'] = 'S';
      } else if( property.rowDetail ) {
        item['DIVISION'] = 'DT';
      } else if( property.rowPopup ) {
        item['DIVISION'] = 'P';
      } else if( property.btn ) {    
        item['BTN_KEY'] = property.btnKey;
        item['DIVISION'] = 'BUTTON';
      }
      
      updateSelection([item]);
    }
  }



  

  //let rowUpd = '';  
  return (    
    <>
      <div className='overflow-auto'>
        <table className="relative table-fixed w-full">
          <thead>
            <tr className='w-full'>
            {selectCheck && (
              <th className='sticky top-0 py-3 bg-stroke' style={{"width": "3%"}}>
                <input type="checkbox" checked={isSelectedAll()} onChange={onChangeSelectAll} />
              </th>
            )}            
            {headers.map( ( header ) => ( !header.hidden && (
              
              <th key={header.text} className='sticky top-0 py-3 font-size bg-stroke text-black' style={{"width": header.width}}> {header.text}</th>
            )))}
            </tr>
          </thead>
          <tbody>
          {
            items.length > 0 ? 
          
            items.map((item, index) => (
            <tr
              key={index}
              className={`
                ${selection.has(item[itemKey]) ? 'select_row' : ''} 
                ${item.disabled ? 'disabled_row' : ''}
                tableLine
              `}
            >
              {selectCheck && (
                <td className={`text-center ${rowClick === index ? "bg-meta-5 text-white":""}`} style={{"width": "3%"}}>
                  {selection.has(item[itemKey])}
                  <input
                    id={`check_${item[itemKey]}`}
                    type="checkbox"
                    disabled={item.disabled}
                    checked={selection.has(item[itemKey])}
                    onChange={() => onChangeSelect(item[itemKey])}
                  />
                </td>
              )}
              {/* headerKey를 순회하면서 key를 가져옴 */}
              {headerKey.map((key) => {
                let propertis = headers.filter( row => row.value === key )[0];
                
                let alignCss = '';
                if( propertis.align === 'center' ) {
                  alignCss = 'text-center';
                } else if( propertis.align === 'right' ) {
                  alignCss = 'text-right';
                } else {
                  alignCss = 'pl-2';
                }
                

                let initValue = '';
                if( !uf_isNull(propertis.btnKey)  ) {
                  initValue = propertis.btnKey;
                }

                
                // tree type
                if( type === 'tree' ) {
                  return (
                    item['MENU_LEVEL'] === 1 ?
                      <td key={key + index} className={`font-size ${alignCss} ${item['USE_YN'] === 'N'? 'bg-meta-7':''} ${propertis.hidden ? 'hidden':''}`}>
                      {
                        propertis.btn ? (
                          initValue ? (                                                      
                            <span className="inline-flex items-center justify-center rounded-md bg-primary px-2 py-1 font-size font-small text-white hover:bg-opacity-90 cursor-pointer"
                            onClick={() => funcSelect('BUTTON', item, initValue)}
                          >{propertis.btn}
                          </span>
                          ):(
                          <span className="inline-flex items-center justify-center rounded-md bg-primary px-2 py-1 font-size font-small text-white hover:bg-opacity-90 cursor-pointer"
                            onClick={() => funcSelect('BUTTON', item, initValue)}
                          >{propertis.btn}
                          </span>
                          )                         
                        ) : <span>{item[key]}</span>
                      }                        
                      </td>                      
                    : 
                    <td key={key + index} className={`font-size ${alignCss} ${item['USE_YN'] === 'N'? 'bg-meta-7':''} ${propertis.hidden ? 'hidden':''}`} >
                      {
                        propertis.possibleDepth !== '2' ? (                          
                          propertis.treeMain ? (
                            <span style={{'marginLeft': `${item['MENU_LEVEL']}rem`}} >{item[key]}</span>
                          ) : (item[key]) 
                        ) : 
                        <span className="inline-flex items-center justify-center rounded-md bg-primary px-2 py-1 font-size font-small text-white hover:bg-opacity-90 cursor-pointer"
                          onClick={() => funcSelect('BUTTON', item, initValue)}
                        >{propertis.btn}
                      </span>
                      }
                    </td>
                  )              
                } else {
                // 리스트 type
                  let itemVal = '';
                  
                  if( propertis.format ) {
                    itemVal = uf_formatChange(propertis.format,item[key]);
                  } else {
                    itemVal = item[key];
                  }
                  return (
                    <td key={key + index} className={`font-size ${alignCss} ${propertis.hidden ? 'hidden':''} ${rowClick === index ? "bg-meta-5 text-white":""} cursor-pointer`} 
                      style={{"width": propertis.width}} 
                      onClick={() => {funcEventHandler(index, propertis, item, tdColor)}}>
                      { 
                        propertis.btn ? (
                          <span className="inline-flex items-center justify-center rounded-md bg-primary px-2 py-1 font-size font-small text-white hover:bg-opacity-90 cursor-pointer"
                            onClick={() => funcSelect('BUTTON', item, initValue)}
                          >{propertis.btn}
                          </span>
                        ) : (
                          <span>{itemVal}</span>
                        )
                        // propertis.btn ? (
                        //   initValue ? (
                            
                        //     <span className="inline-flex items-center justify-center rounded-md bg-primary px-2 py-1 font-size font-small text-white hover:bg-opacity-90 cursor-pointer"
                        //     onClick={() => funcSelect('BUTTON', item, initValue)}
                        //   >{propertis.btn}
                        //   </span>
                        //   ):(
                        //   <span className="inline-flex items-center justify-center rounded-md bg-primary px-2 py-1 font-size font-small text-white hover:bg-opacity-90 cursor-pointer"
                        //     onClick={() => funcSelect('BUTTON', item, initValue)}
                        //   >{propertis.btn}
                        //   </span>
                        //   )                          
                        //) : (                          
                          // propertis.rowUpd ? (
                          //   <span className='cursor-pointer' onClick={() => funcSelect('U', item, initValue)}>{itemVal}</span>
                          // ) : propertis.rowSelect ? (
                          //   <span className='cursor-pointer' onClick={() => funcSelect('S', item, initValue)}>{itemVal}</span>
                          // ) : propertis.rowDetail ? (                                
                          //   <span className='underline underline-offset-8 cursor-pointer' onClick={() => funcSelect('DT', item, initValue)}>{itemVal}</span>
                          // ) : propertis.rowPopup ? (
                          //     <span className='underline underline-offset-8 cursor-pointer' onClick={() => funcSelect('P', item, initValue)}>{itemVal}</span>
                          // ) : (
                          //   <span>{itemVal}</span>
                          // )//( <span onClick={() => funcSelect('N', item)}>{itemVal}</span> )
                        //)
                      } 
                    </td>                      
                  )
                }
              })}
            </tr>
          )) : <tr><td className='text-center font-size' style={{'width':'100%', 'height':'10em'}} colSpan={selectCheck ? (headerCnt + 1) : headerCnt}>조회된 데이터가 없습니다.</td></tr>}
          </tbody>
        </table>
        <div className='p-4'></div>
      </div>
    </>
  );
}
