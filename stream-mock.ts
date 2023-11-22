// deno-lint-ignore-file

let markdownStr :string =  `
## Table

| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |

### Code
\`\`\`Javascript
for await(let conn of Deno.serve(xx){
    ...
}
console.log(1)
\`\`\`
## End`
let readableStream = new ReadableStream<string>({
    async start(controller){
        for(let char of markdownStr ){
            await new Promise(ok=>setTimeout(ok,Math.random()*300))
            controller.enqueue(char)
        }
    }
})
readableStream.pipeTo(new WritableStream<string>({
    write(chunk){
        Deno.stdout.write(new TextEncoder().encode(chunk))
    }
}))