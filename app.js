const fs = require('fs');

const stream = fs.createReadStream('./data/data.txt');

let isValid = true;

const stack = [];

const validateChunk = (chunk) => {
    for (let i in chunk) {
        if(chunk[i] === '{') {
            stack.push(chunk[i])
        }
        else if (chunk[i] === '}') {
            let pop = stack.pop()
            if(pop === undefined)
                isValid = false
        }
    }
}

stream.on('data', (data) => {
    let chunk = data.toString();
    stream.pause();
    validateChunk(chunk);
    if(!isValid) {
        stream.destroy();
        return
    }
    stream.resume();
})

stream.on('close', () => {
    console.log('Closing the stream.');
    if(stack.length === 0 && isValid) {
        console.log('Evething looks okay!')
    } else {
        console.log('The one or more parenthesis are missing.');
    }
})
