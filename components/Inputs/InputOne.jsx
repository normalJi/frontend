import cn from "@/components/common/util/ClassName";

const InputOne = ({className, label, propertyName, value, onChange, disabled, required, inputGb, ...inputProps}) => {  
	return (	
		<div className='flex w-full'>
			<div className="w-24 flex items-center mb-2">
				<label className="mr-3 text-black font-size">
					{label}
					<span className={`font-bold text-meta-1 ${required ? '' : 'hidden'}`}>*</span>
				</label>
			</div>
			<div className="flex flex-1 relative shadow-sm">
				<input
					type="text"
					name={propertyName}
					disabled={disabled}
					value={value}
					onChange={onChange}
          className={cn('border-[1px] pr-9 border-stroke bg-transparent py-2 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter font-size', className)}
					{...inputProps}
				/>
				<div className={`${inputGb === 'str' ? "hidden" : ""}`}>
					<div className={`absolute inset-y-0 right-2 flex items-center font-size`}>만원</div>
					
				</div>				
			</div>
		</div>
	)
}

export default InputOne;