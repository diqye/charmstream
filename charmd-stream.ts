// deno-lint-ignore-file
import { renderMarkdown } from 'https://deno.land/x/charmd/mod.ts';


export default async function(){
    let textEncoder = new TextEncoder()
    let textDecoder = new TextDecoder()
    let mdstream = (mds:string[]) =>new TransformStream<string,string>({
        transform(chunk,controller){
            mds.push(chunk)
            let markdownText = renderMarkdown(mds.join(""))
            controller.enqueue("\x1b[H\x1b[J")
            controller.enqueue(renderMarkdown(markdownText))
        }
    })
    await Deno.stdin.readable.pipeThrough(new TextDecoderStream())
    .pipeThrough(mdstream([]))
    .pipeThrough(new TextEncoderStream()).pipeTo(Deno.stdout.writable)
}

