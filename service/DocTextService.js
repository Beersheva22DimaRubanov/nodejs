import fs from 'node:fs/promises';

export default class DocTextService{
  
  async getDocumentation(file){
    return await this.#getStream(file, true);
  }
  
  async getText(file){
    return await this.#getStream(file, false);
  }

  async #getStream(file, isDoc){
    const handler = await fs.open(file);
      let streamInput = handler.createReadStream();
      streamInput.setEncoding('utf-8')
      streamInput = streamInput.flatMap(chunk => chunk.split('\n')).filter(line => {
        const res = line.trim().startsWith('//');
        return isDoc ? res : !res;
      })
      .map(line=>isDoc ? line.substr(2) : line);
      
      return streamInput;
    }
  }
