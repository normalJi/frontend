'use client';
import cn from "@/components/common/util/ClassName";
const Button = ({label, className, onClick}) => {
  return (
    <span className={cn("rounded-xl inline-flex items-center justify-center px-5 btn-size font-size text-white hover:bg-opacity-90 cursor-pointer", className)}
      onClick={onClick}>{label}
    </span>
                    
  )
}

export default Button;