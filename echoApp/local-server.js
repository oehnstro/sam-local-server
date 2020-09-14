const express = require('express')
const server = express()
const port = 5000

// Require your application file with all your javascript functions exported
// TODO: Read this from the template.yaml file
const app = require('./app')

// Add the routes that you want to simulate
// TODO: Read these from the template.yaml file
server.get('/', expressHandler(app.echo))


server.listen(port, () => {
    console.log(`Local HTTP API simulated at http://localhost:${port}`)
})

const context = {}

function expressHandler(lambdaHandler) {
    // TODO: log request
    return (req, res) => {
        lambdaHandler(toLambdaEvent(req), context).then(lambdaResponse => {
            for (const [key, value] of Object.entries(lambdaResponse.headers || {})) {
                res.set(key, value)
            }
            res.status(lambdaResponse.statusCode).send(lambdaResponse.body)
        }).catch(err => {
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
