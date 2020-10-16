const express = require('express')
const server = express()
const port = 5000

// Enables body.json()
server.use(express.json())

// Require your application file with all your javascript functions exported
// TODO: Read this from the template.yaml file
const app = require('./app')

// Add the routes that you want to simulate
// TODO: Read these from the template.yaml file
server.get('/', expressHandler(app.echo))


// Fallback route with reminder to add routes to both places
server.get('*', (req, res) => {
    res
      .status(404)
      .send(
        `No route for ${req.method} ${req.path} found, did you add it to local-server.js as well as the template.yaml?`
      )
  })

server.listen(port, () => {
    console.log(`Local HTTP API simulated at http://localhost:${port}`)
})

const context = {}

function expressHandler(lambdaHandler) {
    return (req, res) => {
      lambdaHandler(toLambdaEvent(req), context)
        .then(lambdaResponse => {
          res.set(lambdaResponse.headers)
          res.set(lambdaResponse.multiValueHeaders)
          
          // TOOD: Add timeout? and logging for how long the request took?
          console.log(`${lambdaResponse.statusCode}: ${req.method} ${req.path}`)
          
          res.status(lambdaResponse.statusCode).send(lambdaResponse.body)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }

function toLambdaEvent(expressRequest) {
    // Example from: https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
    // Unsupported fields are set to undefined
    return {
        "version": "2.0",
        "routeKey": undefined,
        "rawPath": expressRequest.path,
        "rawQueryString": expressRequest.originalUrl, // TODO
        "cookies": expressRequest.get('Cookie') && expressRequest.get('Cookie').split('; '), // This might need to be an empty array if there are no cookies
        "headers": expressRequest.headers,
        "queryStringParameters": expressRequest.query,
        "requestContext": {
            "accountId": undefined,
            "apiId": undefined,
            "authorizer": undefined,
            "domainName": undefined,
            "domainPrefix": undefined,
            "http": {
                "method": expressRequest.method,
                "path": expressRequest.path,
                "protocol": "HTTP/1.1",
                "sourceIp": expressRequest.ip,
                "userAgent": expressRequest.get('User-Agent')
            },
            "requestId": undefined,
            "routeKey": undefined,
            "stage": undefined,
            "time": undefined,
            "timeEpoch": Date.now()
        },
        "body": expressRequest.body,
        "pathParameters": expressRequest.params,
        "isBase64Encoded": false,
        "stageVariables": {}
    }
}
