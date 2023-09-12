import fs from 'node:fs/promises';
import http from 'node:http';

//stream theory
//writable stream(write)
//readable stream(read)
//duplex (write, read) socket
//transform ZipLibrary
//Example:
// <readable stream>.pipe(<writable stream>)
//<socket stream>.map<request => protocol.getResponse(request)>.pipe(<socket stream>)
//pipeline(<readable stream>, <transform stream>, <writable stream>)

const isComments = process.arg[2] == 'comments'
const fileInput = process.argv[2] || 'appl-streams.js';
const fileOutput = process.argv[3] || 'appl-streams-out';
const handlerInput = await fs.open(fileInput);
const handlerOutput = await fs.open(fileOutput, 'w');
// handlerInput.readFile('utf-8').then(data => console.log(data))
const streamOutput = handlerOutput.createWriteStream();

getStreamWith(handlerInput, isComments).pipe(streamOutput);

function getStreamWith(handler, isComments){
  let streamInput = handler.createReadStream();
  streamInput.setEncoding('utf-8')
  streamInput = streamInput.flatMap(chunk => chunk.split('\n')).filter(line => {
    const res = line.trim().startsWith('//');
    return isComments ? res : !res;
  })
  .map(line=>isComments ? line.substr('//') : line);
  return streamInput;
}



