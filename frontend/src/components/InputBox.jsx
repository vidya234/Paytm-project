export default function InputBox ({onChange, type, label , placeholder,}){
    return(
        <div className="text-sm font-medium py-2" >
            <div className=" text-black flex">{label}</div> 
            <input className="w-full py-1 text-slate-700 pointer-events-auto border-slate-500" onChange = {onChange} type = {type} placeholder={placeholder} required="true"></input>
        </div>
    )
}


