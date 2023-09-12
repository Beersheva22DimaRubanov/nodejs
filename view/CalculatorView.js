export default class CalculatorView{
  getHtml(result, isError){
    return `<label style="color:${isError ? "red": "green"};font-size:40px;display:block;text-align:center">${result}</label>`
  }
}