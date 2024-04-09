'use client';
import cn from '@/components/common/util/ClassName';

const Input = ({ type, propertyName, className, onChange, value, ...inputs }) => {
  return(
    <input
        type={type}
        name={propertyName}
        onChange={onChange}
        value={value}
        className={cn("custom-input-date custom-input-date-1  rounded border border-stroke bg-transparent px-3 py-2 font-size outline-none transition focus:border-primary active:border-primary", className)}
    />
  );
}

export default Input;