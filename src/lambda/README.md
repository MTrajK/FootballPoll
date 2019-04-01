# AWS Lambda

In this application we have 7 AWS [Lambda](https://aws.amazon.com/lambda/) functions:

- 6 of them are used like API calls (using the Amazon [API Gateway](https://aws.amazon.com/api-gateway/) service)
- 1 of them is triggered by a scheduler (using the Amazon [CloudWatch](https://aws.amazon.com/cloudwatch/) service).

All functions are located in [functions](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/functions) directory.\
All unit tests are located in [tests](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/tests) directory.

## HTTP/Rest calls (API Gateway)

- **[add_participant](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/functions/add_participant.py)** - Adds a new participant into the current poll. (*REST **POST** method*)

    **Lambda policies/permisions (used DynamoDB operation - table):**\
    get_item - fp.config\
    get_item - fp.polls\
    query - fp.participants\
    put_item - fp.participants

    **Request body:**
    ```json
    {
        "person" : "",
        "friend" : ""
    }
    ```

- **[delete_participant](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/functions/delete_participant.py)** - Deletes a participant from the current poll. (*REST **DELETE** method*)
    
    **Lambda policies/permisions (used DynamoDB operation - table):**\
    get_item - fp.config\
    delete_item - fp.participants

    **Request body:**
    ```json
    {
        "participant_id" : ""
    }
    ```

- **[get_old_polls](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/functions/get_old_polls.py)** - Returns at most 5 polls, older than the oldest poll on the web site. (*REST **GET** method*)

    **Lambda policies/permisions (used DynamoDB operation - table):**\
    batch_get_item - fp.polls

    **Request body:**
    ```json
    {
        "last_poll" : ""
    }
    ```

- **[get_poll_participants](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/functions/get_old_polls.py)** - Returns all participants for the wanted poll.(*REST **GET** method*)

    **Lambda policies/permisions (used DynamoDB operation - table):**\
    query - fp.participants

    **Request body:**
    ```json
    {
        "poll_id" : ""
    }
    ```

- **[get_site_data](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/functions/get_site_data.py)** - Returns all data needed to start the web site (current poll info, current poll participants, all persons - for stats, 3 polls older than the current). (*REST **GET** method*)

    **Lambda policies/permisions (used DynamoDB operation - table):**
    get_item - fp.config\
    batch_get_item - fp.polls\
    query - fp.participants\
    scan - fp.persons

    **Request body:**
    ```json
    {}
    ```

- **[update_current_poll](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/functions/update_current_poll.py)** - Updates the current poll info (end, dt, title, note, locDesc, locUrl, need, max - some of these or all). (*REST **PUT** method*)

    **Lambda policies/permisions (used DynamoDB operation - table):**\
    get_item - fp.admins\
    get_item - fp.config\
    query - fp.participants\
    update_item - fp.polls

    **Request body:**
    ```json
    {
        "adimin_name" : "",
        "admin_password" : "",
        "title" : "",
        "note" : "",
        "locUrl" : "",
        "locDesc" : "",
        "max" : "",
        "need" : "",
        "end" : "",
        "dt" : ""
    }
    ```

## Scheduled call (CloudWatch)

- **[check_if_current_poll_expired](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/functions/check_if_current_poll_expired.py)** - Checks if the current poll is expired (if current date is greater than the end date from the current poll). If the current poll is expired then updates the persons table with the participants from the current poll, updates the current poll id in the config table and creates a new poll.\
This function will be executed (with the [CloudWatch Event Rule](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/Create-CloudWatch-Events-Scheduled-Rule.html) that triggers on a schedule) every day at 00:01 (or 22:01 according to GMT, eu-central-1 region is GMT +2), [cron expression](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html): 1 22 * * ? *.

    **Lambda policies/permisions (used DynamoDB operation - table):**\
    get_item - fp.config\
    get_item - fp.polls\
    query - fp.participants\
    scan - fp.persons\
    batch_write_item - fp.persons\
    update_item - fp.persons\
    put_item - fp.polls\
    update_item - fp.config

### Resources

[Official AWS Amazon documentation about lambdas](https://docs.aws.amazon.com/lambda/index.html)