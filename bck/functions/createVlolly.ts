


  const AWS = require("aws-sdk");
  const docClient = new AWS.DynamoDB.DocumentClient();
  const eventBridge = new AWS.EventBridge();
  import Lolly from "./type";
  
  async function createVlolly(lolly: Lolly) {
    const params = {
      TableName: process.env.LOLLY_TABLE,
      Item: lolly,
    };
    try {
      await docClient.put(params).promise();
     await eventBridge
        .putEvents({
          Entries: [
            {
              EventBusName: "LollyBus",
              Source: "lollusource",
              DetailType: "newlolly",
              Detail: `{ "lollyData": "${lolly}" }`,
            },
          ],
  
        })
        .promise()
        return lolly;
    } catch (err) {
      console.log("DynamoDB error: ", err);
      return null;
    }
  }
  
  export default createVlolly;
  
  // exports.handler = (event: any, context: any) => {
  //   console.log(event);
  //   context.succeed(event);
  //   return context.pipeline;
  // };
  