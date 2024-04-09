import cn from "../common/util/ClassName";

/**
 * 
 * @param {*} label
 * @param {*} propertyName
 * @param {*} value
 * @param {*} onChange
 * @param {*} className
 * @param {*} inputProps
 * @returns 
 */
const TextArea = ({className, label, propertyName, value, onChange, ...inputProps}) => {

  return (
    <div className='flex mt-2'>
      <div className='w-24 flex items-center mb-2'>
        <label className="mr-3 text-black font-size">{label}</label>
      </div>
      <div className="flex flex-1 relative shadow-sm">
        <textarea													
          name={propertyName}
          value={value}
          onChange={onChange}    
          className={cn("border-[1px] border-stroke bg-transparent py-3 px-5 font-size font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter", className)}
          {...inputProps}
        ></textarea>
      </div>
    </div>		    
  )

}

export default TextArea;