const lambdaFunction = require('./index.js')

//Call your exports function with required params
//In AWS lambda these are event, content, and callback
//event and content are JSON object and callback is a function
//In my example i'm using empty JSON
lambdaFunction.handler(
  {}, //event
  {}, //content
  (data, ss) => {
    //callback function with two arguments
    console.log('testHandler Data: ', data)
  }
)
