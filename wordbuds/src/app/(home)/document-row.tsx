import { TableCell,TableRow } from "@/components/ui/table";
import { Doc } from "../../../convex/_generated/dataModel";
import { SiGoogledocs } from "react-icons/si";
import { Building2Icon, CircleUserIcon, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { DocumentMenu } from "./dropdown-menu";
import { useRouter } from "next/navigation";

interface DocumentRowProps{

    document:Doc<"documents">;
};

export const DocumentRow = ({document}:DocumentRowProps) =>{
    const router = useRouter();
    const onRowClick = (id:string)=>{
        router.push(`/documents/${id}`);
    }
    const onNewTabClick = (id:string) =>{
        window.open(`/documents/${id}`,"_blank");
    }
    return(
        <TableRow onClick={()=>onRowClick(document._id)} className="cursor-pointer">
            <TableCell className="w-14  border-none">
                <SiGoogledocs  className="size-6 fill-blue-500 border-none"/>
            </TableCell>
            <TableCell className="font-medium md:w-[45%] border-none" >
                {document.title}
            </TableCell>
            <TableCell className="text-muted-foreground hidden md:flex items-center gap-2 border-none">
                {document.organisationID ? <Building2Icon className="size-4" /> : <CircleUserIcon className="size-4" />}
                {document.organisationID ? "Organisation" : "Personal"}
            </TableCell>
            <TableCell className = "text-muted-foreground hidden md:table-cell border-none">
                {format(new Date(document._creationTime),"MMM dd, yyyy")}
            </TableCell>
            <TableCell className="flex justify-end border-none">
                <DocumentMenu documentID = {document._id} title = {document.title} onNewTab = {onNewTabClick} />
            </TableCell>
        </TableRow>
    )
}