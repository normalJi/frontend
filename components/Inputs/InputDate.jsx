import cn from "@/components/common/util/ClassName";

const InputDate = ({className, label, propertyName, disabled, required, ...inputProps}) => {  
	return (	
		<div className='flex mt-2'>
			<div className="w-24 flex items-center mb-2">
				<label className="mr-3 text-black font-size">
					{label}
					<span className={`font-bold text-meta-1 ${required ? '' : 'hidden'}`}>*</span>
				</label>
			</div>
			<div className="flex flex-1 relative shadow-sm">
        <input
            type="date"
            name={propertyName}            
            className={cn("w-34 custom-input-date custom-input-date-1  rounded border border-stroke bg-transparent px-3 py-2 font-size outline-none transition focus:border-primary active:border-primary", className)}
            {...inputProps}
        />
			</div>
		</div>
	)
}

export default InputDate;