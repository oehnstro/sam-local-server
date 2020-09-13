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
    return {
        "version": "2.0",
        "routeKey": "$default",
        "rawPath": expressRequest.path,
        "rawQueryString": "parameter1=value1&parameter1=value2&parameter2=value",
        "cookies": [ // TODO: "All cookie headers in the request are combined with commas and added to the cookies field."
            "cookie1",
            "cookie2"
        ], // https://expressjs.com/en/4x/api.html#req.cookies
        "headers": {
            "Header1": "value1",
            "Header2": "value1,value2"
        },
        "queryStringParameters": {
            "parameter1": "value1,value2",
            "parameter2": "value"
        },
        "requestContext": {
            "accountId": "123456789012",
            "apiId": "api-id",
            "authorizer": {},
            "domainName": "id.execute-api.us-east-1.amazonaws.com",
            "domainPrefix": "id",
            "http": {
                "method": expressRequest.method,
                "path": expressRequest.path,
                "protocol": "HTTP/1.1",
                "sourceIp": "IP",
                "userAgent": "agent"
            },
            "requestId": "id",
            "routeKey": "$default",
            "stage": "$default",
            "time": "12/Mar/2020:19:03:58 +0000",
            "timeEpoch": Date.now()
        },
        "body": expressRequest.body,
        "pathParameters": expressRequest.params,
        "isBase64Encoded": false,
        "stageVariables": {}
    }
}
