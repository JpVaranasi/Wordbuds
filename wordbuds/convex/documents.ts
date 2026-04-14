import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
export const create = mutation({
    args:{title:v.optional(v.string()),initialContent:v.optional(v.string())},
    handler:async(ctx,args)=>{
        const user = await ctx.auth.getUserIdentity();
        if(!user){
            throw new ConvexError("Unauthorised");
        }
        const organisationID = (user.organisation_id ?? undefined) as | string | undefined;

        return await ctx.db.insert("documents",{title: args.title ?? "Untitled document",ownerID:user.subject,organisationID,initialContent:args.initialContent})
    },
});
export const get = query({
    args:{paginationOpts:paginationOptsValidator, search: v.optional(v.string())},
    handler:async(ctx,{search,paginationOpts})=>{
        const user = await ctx.auth.getUserIdentity();
        if(!user){
            throw new ConvexError("Unauthorised")
        }
        const organisationId = (user.organisation_id ?? undefined) as | string | undefined;

        if(search && organisationId){
            return await ctx.db.query("documents").withSearchIndex("search_title",(q)=> q.search("title",search).eq("organisationID",organisationId)).paginate(paginationOpts)
        }

        if(search){
            return await ctx.db.query("documents").withSearchIndex("search_title",(q) => q.search("title",search).eq("ownerID",user.subject)).paginate(paginationOpts)
        }
        if(organisationId){
            return await ctx.db.query("documents").withIndex("by_organisation_id",(q)=> q.eq("organisationID",organisationId)).paginate(paginationOpts);
            
        }
        return await ctx.db.query("documents").withIndex("by_owner_id",(q)=> q.eq("ownerID",user.subject)).paginate(paginationOpts);
    }
})

export const removeById = mutation({
    args:{id:v.id("documents")},
    handler: async (ctx,args) =>{
        const user = await ctx.auth.getUserIdentity();
        if(!user){
            throw new ConvexError("Unauthorised")
        }
        const organisationId = (user.organisation_id ?? undefined) as | string | undefined;

        const document = await ctx.db.get(args.id);
        if(!document){
            throw new ConvexError("Document Not Found");
        }
        const isOwner = document.ownerID === user.subject;
        if(!isOwner && document.organisationID && !(document.organisationID === organisationId)){
            throw new ConvexError("Unauthorised");
        }
        return await ctx.db.delete(args.id);
    }
})

export const updateByID = mutation({
    args:{id:v.id("documents"),title:v.string()},
    handler: async (ctx,args) =>{
        const user = await ctx.auth.getUserIdentity();
        if(!user){
            throw new ConvexError("Unauthorised")
        }
        const document = await ctx.db.get(args.id);
        if(!document){
            throw new ConvexError("Document Not Found");
        }
        const isOwner = document.ownerID === user.subject;
        if(!isOwner){
            throw new ConvexError("Unauthorised");
        }
        return await ctx.db.patch(args.id,{title:args.title});
    }
})

export const getById = query({
    args:{id:v.id("documents")},
    handler:async(ctx,{id}) =>{
        const document = await ctx.db.get(id);
        if(!document){
            throw new ConvexError("Document not found");
        }

        return document;
    },
})