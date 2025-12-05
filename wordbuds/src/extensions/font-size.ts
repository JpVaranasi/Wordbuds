import { Extension } from "@tiptap/react";
import "@tiptap/extension-text-style"
import { AlertTriangle } from "lucide-react";

declare module "@tiptap/core"  {
    interface Commands<ReturnType> {
        fontsize: {
            setFontSize: (size: string) => ReturnType
            unsetFontsize: () => ReturnType
        }
    }
}

export const FontSizeExtension = Extension.create({
    name: "fontSize",

    addOptions() {
        return {
         types:  ["textStyle"],
        };
    },
    addGlobalAttributes() {
        return [
           {
             types: this.options.types,
             attributes: {
                fontSize: {
                    default: null,
                    parseHTML: element => element.style.fontSize,
                    renderHTML: attributes => {
                        if (!attributes.fontSize) {
                            return {};
                        }

                        return {
                            style: `font-size: ${attributes.fontSize}`,
                        }
                    }
                }
             }
           } 
        ]
    },
    addCommands() {
        return {
            setFontSize: (fontSize: string) => ({ chain }) => {
                return chain()
                .setMark("textStyle", { fontSize })
                .run()
            },
            unsetFontSize: () => ({ chain }:any) => {
                return chain()
                .setmark("textStyle", { fontSize: null})
                .removeEmptyTextStyle()
                .run()
            },

        }
    },
});