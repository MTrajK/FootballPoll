# Football Poll

A serverless application which uses the Amazon Web Services as the backend and it's hosted on Github pages.\
Inspired by [Doodle](https://doodle.com), this application is recreating the poll after it ends (the new poll last one week and the event time and day are the same as the previous poll, only the admin can change this).\
This application is saving the old polls and everyone can access them, also there is a simple statistic: how many events participates each player and how many friends invited each player.

![Official banner](https://raw.githubusercontent.com/MTrajK/FootballPoll/master/images/banner.png "Official banner")

## Project Structure

The project is composed of 3 parts: database, functions and web site.

### Database (Amazon DynamoDB)

Located in [src/dynamodb](https://github.com/MTrajK/FootballPoll/blob/master/src/dynamodb/) directory.\
More info about the database in the [README file](https://github.com/MTrajK/FootballPoll/blob/master/src/dynamodb/README.md).

### Functions (AWS Lambda)

Located in [src/lambda](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/) directory.\
More info about the lambdas in the [README file](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/README.md).

### Web site

Located in [src/site](https://github.com/MTrajK/FootballPoll/blob/master/src/site/) directory.\
The web site is hosted on github, from the gh-pages branch.

## Tech/frameworks

- [DynamoDB](https://aws.amazon.com/dynamodb/) - Fast and flexible NoSQL database service for any scale
- [Python 3.7](https://www.python.org) - An interpreted, high-level, general-purpose programming language
- [Boto 3]() - AWS SDK for Python
- [Vue.js](https://vuejs.org/) - JavaScript framework
- [Materialize.css](http://materializecss.com/) - Front-end framework based on Material Design
- [Axios.js](https://github.com/axios/axios) - Promise based HTTP client
- [Roboto fonts](https://fonts.google.com/specimen/Roboto) - Official Roboto fonts from Google
- [Material design icons](https://material.io/tools/icons/) - Official Material Design icons from Google

## Amazon Pricing

Only for the services used in this application, EU-Central-1 region (Frankfurt).

### API Gateway

2 types of pricing: requests and data out

- requests (12 months free - 1 million requests per month) - $3.5 per 1 million requests monthly (1 request = $0.0000035)
- data out (not free) - $0.09 per 1GB response payload monthly (1KB = $0.0000009) (100 000 calls * 5KB response body = 0.5GB data out)

### Lambda

2 types of pricing: requests and memory allocation (execution time)

- requests (always free - 1 million requests per month) - $0.20 per 1 million requests monthly (1 request = $0.0000002)
- memory allocation (always free - 400 000 GB-seconds per month up to 3.2 million seconds of compute time per month) - $0.00001667 for every GB-second

### CloudWatch

1 type of pricing: events

- execution/invoke of event (not free) - $1 per 1 million events (1 event = $0.000001)

### DynamoDB

3 types of pricing for [provisioned capacity](https://aws.amazon.com/dynamodb/pricing/provisioned/): storage, RCU and WCU (enough to handle up to 200 million requests per month)

- storage (always free - 25GB) - $0.306 per GB-month
- RCU (always free - 25 units per month) - $0.0001586 per RCU per hour (for items up to 4 KB in size, one RCU for each strongly consistent read per second, and one-half of an RCU for each eventually consistent read per second)
- WCU (always free - 25 units per month) - $0.000793 per WCU per hour (for month with 30 days 0.000793*720 = $0.57096)(for items up to 1 KB in size, one WCU can perform one standard write request per second)

### Calculators

- [CloudWatch and DynamoDB calculator](https://calculator.s3.amazonaws.com/index.html)
- [API Gateway calculator](https://dashbird.io/api-gateway-cost-calculator/)
- [Lambda calculator 1](https://dashbird.io/lambda-cost-calculator/)
- [Lambda calculator 2](https://s3.amazonaws.com/lambda-tools/pricing-calculator.html)

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details