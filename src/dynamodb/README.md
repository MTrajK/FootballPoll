# Amazon DynamoDB

Here you can read how to create and fill the database, more about the goals of this db, db structure and AWS implementation.

## Create and fill all tables

1. To create all tables for this db, run this script: [create_tables/create_all_tables.py](https://github.com/MTrajK/FootballPoll/blob/master/src/dynamodb/create_tables/create_all_tables.py)
2. To fill the tables with the results from the previous polls (read from csv file - [fill_tables/doodle_results.csv](https://github.com/MTrajK/FootballPoll/blob/master/src/dynamodb/fill_tables/doodle_results.csv)), run this script: [fill_tables/fill_tables.py](https://github.com/MTrajK/FootballPoll/blob/master/src/dynamodb/fill_tables/fill_tables.py)

## Goals

Main goals for this NoSQL implementation:

1. **Minimum resurces used** (AWS Always-Free Tier, without additional money/resources - available 25GB of storage, 25 WCU, 25 RCU, enough to handle up to 200M requests per month)
2. **Fast response** (less than 10ms response, you shouldn't "scan" the tables, only search with the partition keys using hashtable approach)

## Database structure

Database is composed of 5 tables:\
(**fp** is short from the app name - FootbalPoll, that is a namespace for all tables used in this application. We need this because in DynamoDB all tables are located in the same workspace.)

1. **Admins**\
    *Table name*: fp.admins\
    *Partition key*: name (string)\
    *Attributes*: password (string), salt (string)\
    *RCU*: 1\
    *WCU*: 1

2. **Config**\
    *Table name*: fp.config\
    *Partition key*: id (string)\
    *Attributes*: value (string)\
    *RCU*: 1\
    *WCU*: 1

3. **Participants**\
    *Table name*: fp.participants\
    *Partition key*: poll (number)\
    *Sort key*: added (number)\
    *Attributes*: person (string), friend (string)\
    *RCU*: 2\
    *WCU*: 2

4. **Persons**\
    *Table name*: fp.persons\
    *Partition key*: name (string)\
    *Attributes*: polls (number), friends (number)\
    *RCU*: 2\
    *WCU*: 2

5. **Polls**\
    *Table name*: fp.polls\
    *Partition key*: id (number)\
    *Attributes*: start (number), end (number), dt (number), title (string), note (string), locDesc (string), locUrl (string), need (number), max (number)\
    *RCU*: 3\
    *WCU*: 1

This db is not designed for relations, it is designed for fast queries (to optimize write/read capacity units), so don't think of it as a relational database!

Simple comparasion between dynamodb and relational databases:

- **table** is same like **table** in relational db
- **item** is same as **row** in relational db
- **attribute** is same as **column** in relational db
- **partition key** is same as **primary key** in relational db
- **partition & sort key** is same as **composite key** in relational db

## AWS implementation

Several important things from the AWS implementation (to keep the main goals)

1. Read Consistency (RCU)
    - **Strongly Consistent Reads** - When you request a strongly consistent read, DynamoDB returns a response with the most up-to-date data, reflecting the updates from all prior write operations that were successful. One *read request unit* **(RCU)** represents one strongly consistent read request for an item up to **4 KB** in size.
    - **Eventually Consistent Reads** - When you read data from a DynamoDB table, the response might not reflect the results of a recently completed write operation. The response might include some stale data. If you repeat your read request after a short time, the response should return the latest data. One *read request unit* **(RCU)** represents two eventually consistent read request for an item up to **4 KB** in size (or a half **RCU** for an item up to **2 KB**).

2. Write Consistency (WCU)
    - There are only **Strongly Consistent Writes**! One *write request unit* represents one **(WCU)** write for an item up to **1 KB** in size.

3. Burst capacity\
DynamoDB provides some flexibility in your per-partition throughput provisioning by providing burst capacity, as follows. Whenever you are not fully using a partition's throughput, DynamoDB reserves a portion of that unused capacity for later bursts of throughput to handle usage spikes.\
DynamoDB currently retains up to five minutes (300 seconds) of unused read and write capacity. During an occasional burst of read or write activity, these extra capacity units can be consumed quickly—even faster than the per-second provisioned throughput capacity that you've defined for your table.

4. Use short names for the attributes, because they are computed in the read memory/capacity (not only the attribute values) (*In DynamoDB, Strings are Unicode with UTF-8 binary encoding. This means that **each character uses 1 to 4 bytes**. Note that strings can’t be empty. The English alphabet, numbers, punctuation and common symbols (&, $, %, etc.) are all 1 byte each. However, the pound sign (£) is 2 bytes! Languages like German and Cyrillic are also 2 bytes, while Japanese is 3 bytes. On the top end, emojis are a whopping 4 bytes each 😲!*)

### Resources

- [Great article for Item’s Size and Consumed Capacity](https://medium.com/@zaccharles/calculating-a-dynamodb-items-size-and-consumed-capacity-d1728942eb7c)
- [Calculator for Item's size](https://zaccharles.github.io/dynamodb-calculator/)
- [Official AWS Amazon documentation about DynamoDB](https://docs.aws.amazon.com/dynamodb/index.html)