import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, FilePen, FilePenIcon, MoreVertical, TrashIcon } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RemoveDialog } from "@/components/remove-dialog";
import { RenameDialog } from "@/components/rename-dialog";

interface DocumentMenuProps{
    documentID:Id<"documents">;
    title:string;
    onNewTab:(id:Id<"documents">) =>void;
}

export const DocumentMenu = ({documentID,title,onNewTab}:DocumentMenuProps) =>{
    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant = "ghost" size="icon" className="rounded-full"><MoreVertical className="size-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <RenameDialog documentID={documentID} initialTitle = {title}>
                    <DropdownMenuItem onSelect={(e)=> e.preventDefault()} onClick={(e) => e.stopPropagation()}><FilePenIcon className = "size-4 mr-2" /> Rename</DropdownMenuItem>
                </RenameDialog>
                <RemoveDialog documentID={documentID}>
                    <DropdownMenuItem onSelect={(e)=> e.preventDefault()} onClick={(e) => e.stopPropagation()}><TrashIcon className = "size-4 mr-2" /> Remove</DropdownMenuItem>
                </RemoveDialog>

                <DropdownMenuItem onClick={()=> onNewTab(documentID)}>
                    <ExternalLinkIcon className="size-4 mr-2" />
                    Open in a new tab
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}