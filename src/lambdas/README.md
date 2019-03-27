# AWS Lambdas

**TODO: Explain (and maybe add all policies in separate folder) here all 10 policies**
**TODO: Explain each lamba which policies is using**
For this application we need only 7 lambda functions, from them 6 are API calls and 1 is a schedulled call (using the CloudWatch service).

## HTTP/Rest calls

- **[get_site_data](https://github.com/MTrajK/FootballPoll/blob/master/src/lambdas/get_site_data.py)** - get current poll id (*read from **fp.config** table*), get current poll info and 3 latest polls (*read from **fp.polls** table*), current poll participants (*read from **fp.participants** table*), statistics (*read from **fp.persons** table*)
- **[update_current_poll](https://github.com/MTrajK/FootballPoll/blob/master/src/lambdas/update_current_poll.py)** - get admin credentials (*read from **fp.admins** table*), get current poll id (*read from **fp.config** table*), change some/all property/ies from the CURRENT poll in db (*update an item from **fp.polls** table*)
- **[add_participant](https://github.com/MTrajK/FootballPoll/blob/master/src/lambdas/add_participant.py)** - get current poll id (*read from **fp.config** table*), add a participant into the CURRENT poll (*put in **fp.participants** table*)
- **[delete_participant](https://github.com/MTrajK/FootballPoll/blob/master/src/lambdas/delete_participant.py)** - get current poll id (*read from **fp.config** table*), delete a participant from the CURRENT poll (*delete an item from **fp.participants** table*)
- **[get_old_polls](https://github.com/MTrajK/FootballPoll/blob/master/src/lambdas/get_old_polls.py)** - get 5 polls (*read from **fp.polls** table*)
- **[get_poll_participants](https://github.com/MTrajK/FootballPoll/blob/master/src/lambdas/get_old_polls.py)** - get all participants from some poll (*read from **fp.participants** table*)

## Scheduled call (ColudWatch)

- **[check_if_current_poll_expired](https://github.com/MTrajK/FootballPoll/blob/master/src/lambdas/check_if_current_poll_expired.py)** - get current poll id (*read from **fp.config** table*), get current poll info (*read from **fp.polls** table*), if expired: update config (*update **fp.config** table*), add new poll (*put an item in **fp.polls** table*), add new persons - if there are any (*put items in **fp.polls** table*)

## API Gateway

**Add description about the API gateway!**

### Resources

[Official AWS Amazon documentation about lambdas](https://docs.aws.amazon.com/lambda/index.html)