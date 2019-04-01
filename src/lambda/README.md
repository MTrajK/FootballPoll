# AWS Lambda

In this application we have 7 AWS [Lambda](https://aws.amazon.com/lambda/) functions:

- 6 of them are used like API calls (using the Amazon [API Gateway](https://aws.amazon.com/api-gateway/) service)
- 1 of them is triggered by a scheduler (using the Amazon [CloudWatch](https://aws.amazon.com/cloudwatch/) service).

All functions are located in [functions](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/functions) directory.\
All unit tests are located in [tests](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/tests) directory.

## HTTP/Rest calls (API Gateway)

- **[add_participant](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/functions/add_participant.py)** - Adds a new participant into the current poll.\
**Lambda policies/permisions - used DynamoDB operations:**\
get_item - fp.config\
get_item - fp.polls\
query - fp.participants\
put_item - fp.participants

- **[delete_participant](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/functions/delete_participant.py)** - Deletes a participant from the current poll.\
**Lambda policies/permisions (used DynamoDB operations) - table:**\
get_item - fp.config\
delete_item - fp.participants

- **[get_old_polls](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/functions/get_old_polls.py)** - Returns at most 5 polls, older than the oldest poll on the web site.\
**Lambda policies/permisions (used DynamoDB operations) - table:**\
batch_get_item - fp.polls

- **[get_poll_participants](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/functions/get_old_polls.py)** - Returns all participants for the wanted poll.\
**Lambda policies/permisions (used DynamoDB operations) - table:**\
query - fp.participants

- **[get_site_data](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/functions/get_site_data.py)** - Returns all data needed to start the web site (current poll info, current poll participants, all persons - for stats, 3 polls older than the current).\
**Lambda policies/permisions (used DynamoDB operations) - table:**\
get_item - fp.config\
batch_get_item - fp.polls\
query - fp.participants\
scan - fp.persons

- **[update_current_poll](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/functions/update_current_poll.py)** - Updates the current poll info (end, dt, title, note, locDesc, locUrl, need, max - some of these or all).\
**Lambda policies/permisions (used DynamoDB operations) - table:**\
get_item - fp.admins\
get_item - fp.config\
query - fp.participants\
update_item - fp.polls

## Scheduled call (CloudWatch)

- **[check_if_current_poll_expired](https://github.com/MTrajK/FootballPoll/blob/master/src/lambda/functions/check_if_current_poll_expired.py)** - Checks if the current poll is expired (if current date is greater than the end date from the current poll). If the current poll is expired then updates the persons table with the participants from the current poll, updates the current poll id in the config table and creates a new poll.\
**Lambda policies/permisions (used DynamoDB operations) - table:**\
get_item - fp.config\
get_item - fp.polls\
query - fp.participants\
scan - fp.persons\
batch_write_item - fp.persons\
update_item - fp.persons\
put_item - fp.polls\
update_item - fp.config

## API Gateway

**TODO: Add a description about the API gateway!**

### Resources

[Official AWS Amazon documentation about lambdas](https://docs.aws.amazon.com/lambda/index.html)