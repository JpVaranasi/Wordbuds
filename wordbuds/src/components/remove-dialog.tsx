"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface RemoveDialogProps{
    documentID: Id<"documents">;
    children: React.ReactNode;
};

export const RemoveDialog = ({documentID,children}:RemoveDialogProps) =>{
    const remove = useMutation(api.documents.removeById);
    const [isRemoving,setIsRemoving] = useState(false);
    return(
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone. This will permanently delete your document.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isRemoving} onClick={(e)=>{e.stopPropagation();setIsRemoving(true);remove({id:documentID}).catch(()=> toast.error("Something went wrong")).then(()=> toast.error("Document Removed")).finally(()=>{setIsRemoving(false)})}}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}