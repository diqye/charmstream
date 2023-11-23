// deno-lint-ignore-file
import { renderMarkdown } from 'https://deno.land/x/charmd/mod.ts';


let mdstream = (mds:string[]=[],lastLen=0) =>new TransformStream<string,string>({
    transform(chunk,controller){
        mds.push(chunk)
        let markdownText = renderMarkdown(mds.join(""))
        if(lastLen > 1){
            controller.enqueue(`\x1b[${lastLen - 1}A`)
        }
        controller.enqueue(`\x1b[J`)
        controller.enqueue(markdownText)
        lastLen = markdownText.split("\n").length
    }
})
export default async function(){
    await Deno.stdin.readable.pipeThrough(new TextDecoderStream())
    .pipeThrough(mdstream())
    .pipeThrough(new TextEncoderStream()).pipeTo(Deno.stdout.writable)
}

