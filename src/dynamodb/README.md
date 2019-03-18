# Amazon DynamoDB

Here you can read more about the goals of this db, db structure and AWS implementation.


## Goals

Main goals for this NoSQL implementation: 

1. **Minimum resurces used** (AWS Always-Free Tier, without additional money/resources - available 25GB of storage, 25 WCU, 25 RCU, enough to handle up to 200M requests per month)
2. **Fast response** (less than 10ms response, don't scan the tables, using hashtable approach, only search with the partition keys)


## Database structure

DB scheme will be composed of 4 tables: 

1.  **Admins** - contains list of admins, each item has these attributes: *admin name* (partition key), *crypted password* and *password salt*
2. **CurrentPoll** - 
3. **ArchivedPolls** - contains list of polls (the items have the same attributes as **CurrentPoll** table - without *AllPlayers* attribute)
4. **Players** - contains list of players, each item has these attributes: *player name* (partition key), *number of played games* (polls participated) and *number of invited friends*

Don't be confused with the relation databases, this db scheme is created to optimize calls (started designing from the lambdas, not from the relations!)

Sort keys aren't used for this implementation.

Simple comparasion with relational databases:

- **table** is same like **table** in relational db
- **item** is same as **row** in relational db
- **attribute** is same as **column** in relational db
- **partition key** is same as **primary key** in relational db


## AWS implementation

Several important things from the AWS implementation (to keep the main goals)

1. Read Consistency
    * **Strongly Consistent Reads** - only the *CurrentPoll* table (this table could be updated from different devices, because the users are avilable to make changes in this table, so if there are lot request for this table then we'll get stale results - *but this should be happen with very small probability because this is a small app and not used often*)
    * **Eventually Consistent Reads** - *Admins*, *ArchivedPolls* and *Players* tables (they are updated only once in a week, so we don't need the latest changes immediatlly)
2. **Auto-scaling** - *ArchivedPolls* and *Players* tables should have auto-scaling only for reads (because they aren't used often, min RCU 1, max RCU 3-4)
	* also *CurrentPoll* and *Admins* could have auto-scaling (there is a small possibility for them to be acceses from more PCs in 1 sec, think about this, let say min RCU 1, max RCU 2. Using the same logic *CurrentPoll* could have auto-scaling for writes, min WCU 1, max WCU 2)
3. Use short names for the attributes, because they are computed in the read memory/capacity (not only the attribute values) (*In DynamoDB, Strings are Unicode with UTF-8 binary encoding. This means that **each character uses 1 to 4 bytes**. Note that strings can’t be empty. The English alphabet, numbers, punctuation and common symbols (&, $, %, etc.) are all 1 byte each. However, the pound sign (£) is 2 bytes! Languages like German and Cyrillic are also 2 bytes, while Japanese is 3 bytes. On the top end, emojis are a whopping 4 bytes each 😲!*)


### Resources

- [Great article for Item’s Size and Consumed Capacity](https://medium.com/@zaccharles/calculating-a-dynamodb-items-size-and-consumed-capacity-d1728942eb7c)
- [Calculator for Item's size](https://zaccharles.github.io/dynamodb-calculator/)
- [Official AWS Amazon documentation about DynamoDB](https://docs.aws.amazon.com/dynamodb/index.html)