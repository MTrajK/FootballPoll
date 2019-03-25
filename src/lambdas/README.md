# AWS Lambdas

For this application we need only 7 lambda functions.

## HTTP/Rest calls

- get site data (read poll info and poll participants from **CurrentPoll** table and 3 lastest archived polls from the **ArchivedPoll** table)
- update something (or everything) into the poll info with admin right (read admin credentials from **Admins** table and update poll info in the **CurrentPoll** table)
- delete a player of friend from the current poll (delete player from the allPlayers and playersNames attributes into the current poll, **CurrentPoll** table)
- add new player/s or/and friend/s to the current poll (add player into the allPlayers and playersNames attributes in the current poll, **CurrentPoll** table)
- get players statistics (scan all of the data from **Players** table)
- get more archived polls (using paggination, read 5 more archived polls from the **ArchivedPoll** table)

## Scheduled call (ColudWatch)

- every day at 00:01 checks if the current poll is expired (read from **CurrentPoll** table, if expired write that data into **ArchivedPolls** table and create a new current poll item in **CurrentPoll** table)

## API Gateway

**Add description about the API gateway!**

### Resources

[Official AWS Amazon documentation about lambdas](https://docs.aws.amazon.com/lambda/index.html)