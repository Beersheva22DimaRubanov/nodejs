
export class PromptHandler {
  constructor(promptAsyncObj) {
      promptAsyncObj.on('close', () => console.log(`all data have been saved`))
      promptAsyncObj.on('positive', num => console.log(`you have entered  ${num}`))
  }
}