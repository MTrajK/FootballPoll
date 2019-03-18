# AWS Lambdas

For this application we need only 6 lambda functions.


## HTTP/Rest calls
- get site data (read poll info and poll participants from **CurrentPoll** table and 3 lastest archived polls from the **ArchivedPoll** table)
- update something (or everything) into the poll info with admin right (read admin credentials from **Admins** table and update poll info in the **CurrentPoll** table)
- add new player or friend to the current poll (update the current poll, **CurrentPoll** table)
- get players statistics (scan all of the data from **Players** table)
- get more archived polls (using paggination, read 5 more archived polls from the **ArchivedPoll** table)


## Scheduled call
- everyday at 00:01 checks if the current poll is expired (read from **CurrentPoll** table, if expired writes that data into **ArchivedPolls** table and created new current poll item in **CurrentPoll** table)


### Resources

[Official AWS Amazon documentation about lambdas](https://docs.aws.amazon.com/lambda/index.html)