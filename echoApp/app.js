let response;

/**
 * This function returns the event and context as a json response
 * in order help develop the event conversion for the local development
 * server.
 * 
 */
exports.echo = async (event, context) => {
    try {
        response = {
            'isBase64Encoded': false,
            'statusCode': 200,
            'body': JSON.stringify({ event: event, context: context }),
            'headers': {
                'Content-Type': 'application/json'
            }
        }

    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
