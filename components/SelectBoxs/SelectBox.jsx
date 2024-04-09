'use client';
import cn from '@/components/common/util/ClassName';

const SelectBox = ({ propertyName, className, onChange, value, array }) => {
  return (
    <select name={propertyName} onChange={onChange} value={value} className={cn('relative z-20 border border-stroke bg-transparent py-2 px-3 text-xs outline-none transition focus:border-primary active:border-primary', className)}>
      {           
        array.length > 0 ? (            
          array.map((code, index) => {
        return (
          <option key={index} value={code.VALUE}>{code.NAME}</option>
        );
      })) : ''}
    </select>    
  )  
}

export default SelectBox;