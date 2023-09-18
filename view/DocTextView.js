export default class DocTextView{
  renderLine(line){
    return `<label style="font-size:1.5em;font-style:italic;display:block;text-align:center">${line}</label>`
  }

  renderError(error, response){
    response.end(`<label style="font-size:1.5em;color:red;font-style:italic;display:block;text-align:center">${error}</label>`)
  }
}