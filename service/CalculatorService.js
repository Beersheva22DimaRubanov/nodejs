import CalculatorView from "../view/CalculatorView.js";

const view = new CalculatorView();
export default class CalculatorService{
  constructor(emitter, operations){
    Array.from(operations.entries()
    .array.forEach(operation => emitter.addListener(operation[0], (operands, response) => {
      this.writeResult(operation[1](operands[0], operands[1]), response)
    })))
  }

  writeResult(result, response){
    response.write(view.getHtml(result, false));
    response.end();
  }
}