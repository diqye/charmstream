// deno-lint-ignore-file
import { renderMarkdown } from 'https://deno.land/x/charmd/mod.ts';


let mdstreamPretty = (mds:string[]=[],lastLen=0) =>new TransformStream<string,string>({
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

let mdstreamDefault = (mds = [] as string[]) =>{
    console.log("\x1b[2J")
    return new TransformStream<string,string>({
        transform(chunk,controller){
            mds.push(chunk)
            let markdownText = renderMarkdown(mds.join(""))
            controller.enqueue("\x1b[H\x1b[J")
            controller.enqueue(markdownText)
        }
    })
}
export default async function(){
    let flag = Deno.args[0]
    await Deno.stdin.readable.pipeThrough(new TextDecoderStream())
    .pipeThrough(flag == "normal" ? mdstreamPretty() : mdstreamDefault())
    .pipeThrough(new TextEncoderStream()).pipeTo(Deno.stdout.writable)
}

