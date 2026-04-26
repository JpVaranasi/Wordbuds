import { BsCloudCheck } from "react-icons/bs"
import { Id } from "../../../../convex/_generated/dataModel";
import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";


interface DocumentInputProps{
    title:string;
    id:Id<"documents">;
}

export const DocumentInput = ({title,id}:DocumentInputProps) => {
    const [value,setValue] = useState(title);
    const [isError,setIsError] = useState(false);
    const [isPending,setIsPending] = useState(false);
    const [isEditing,setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const mutate = useMutation(api.documents.updateByID);
    const debouncedUpdate = useDebounce((newValue:string)=>{
        if(newValue ===title) return;

        setIsPending(true);
        mutate({id,title:newValue}).then(() => toast.success("Document Updated")).catch(()=> toast.error("Something went wrong")).finally(()=>setIsPending(false) )
            
    })
    const onChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const newVal = e.target.value;
        setValue(newVal);
        debouncedUpdate(newVal)
    }
     const handleSubmit = ((e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setIsPending(true);
        mutate({id,title:value}).then(() => {toast.success("Document Updated"); setIsEditing(false);}).catch(()=> toast.error("Something went wrong")).finally(()=>setIsPending(false) )
            
    })
    return (
        <div className="flex items-center gap-2">
           {isEditing?(
            <form onSubmit={handleSubmit} className="relative w-fit max-w-[50ch]">
                <span className="invisible whitespace-pre px-1.5 text-lg">
                    {value||" "}
                </span>
                <input ref={inputRef} onBlur={()=>setIsEditing(false)} value = {value} onChange={onChange} className="absolute inset-0 text-lg text-black px-1.5 bg-transparent truncate" />
            </form>
           ):(
               <span onClick={()=>{
                setIsEditing(true);
                setTimeout(()=>{
                    inputRef.current?.focus();
                },0);
               }} className="text-lg px-1.5 cursor-pointer truncate">{title}</span>

           )} 
    <BsCloudCheck />
    </div>
    )
}