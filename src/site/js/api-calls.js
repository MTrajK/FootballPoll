(function (global) {
  /*
      API: https://v0u768t0yk.execute-api.eu-central-1.amazonaws.com/v1

      POST method:
      add_participant: https://v0u768t0yk.execute-api.eu-central-1.amazonaws.com/v1/add-participant

      DELETE method:
      delete_participant: https://v0u768t0yk.execute-api.eu-central-1.amazonaws.com/v1/delete-participant

      GET methods:
      get_old_polls: https://v0u768t0yk.execute-api.eu-central-1.amazonaws.com/v1/get-old-polls
      get_poll_participants: https://v0u768t0yk.execute-api.eu-central-1.amazonaws.com/v1/get-poll-participants
      get_site_data: https://v0u768t0yk.execute-api.eu-central-1.amazonaws.com/v1/get-site-data

      PUT method:
      update_current_poll: https://v0u768t0yk.execute-api.eu-central-1.amazonaws.com/v1/update-current-poll
  */

  var apiURL = 'https://v0u768t0yk.execute-api.eu-central-1.amazonaws.com/v1/';
  var maxRequestTime = 15000;

  var parsePoll = function (poll) {
    var parsed = {
      title: `${poll.title}`,
      note: `${poll.note}`,
      locationDescription: `${poll.locDesc}`,
      locationURL: `${poll.locUrl}`,
      needPlayers: `${poll.need}`,
      maxPlayers: `${poll.max}`,
      dayTime: parseInt(poll.dt),
      endDate: parseInt(poll.end),
      startDate: parseInt(poll.start),
      pollId: parseInt(poll.id),
    };

    if (parsed.note == '/')
      parsed.note = '';

    return parsed;
  };

  var getSiteData = function (successCallback, errorCallback) {

    axios({
      method: 'get',
      url: apiURL + 'get-site-data',
      timeout: maxRequestTime
    }).then(function (response) {

      var jsonResult = response.data;

      var parsedResult = {
        currentPoll: {
          info: {},
          editInfo: {},
          participants: [],
        },
        allNames: {
          newNames: [],
          oldNames: [],
        },
        participantsStats: {
          playedGames: [],
          invitedFriends: [],
        },
        oldPolls: {
          oldestPollId: undefined,
          selectedPollIdx: undefined,
          polls: [],
        },
      };

      // current poll info
      var oldPolls = [];
      var currentPoll = jsonResult.current_poll;
      var allPolls = jsonResult.polls;
      for (var i = 0; i < allPolls.length; i++) {
        if (allPolls[i].id == currentPoll) {
          parsedResult.currentPoll.info = parsePoll(allPolls[i]);
        } else {
          oldPolls.push({
            info: parsePoll(allPolls[i]),
            participants: undefined,
          })
        }
      }

      // current poll editing info
      // create a deep copy/clone of that object (or use JSON.parse(JSON.stringify(object)))
      parsedResult.currentPoll.editInfo = {
        title: parsedResult.currentPoll.info.title,
        note: parsedResult.currentPoll.info.note,
        locationDescription: parsedResult.currentPoll.info.locationDescription,
        locationURL: parsedResult.currentPoll.info.locationURL,
        needPlayers: parsedResult.currentPoll.info.needPlayers,
        maxPlayers: parsedResult.currentPoll.info.maxPlayers,
      };

      // current poll participants
      var participants = jsonResult.participants;
      participants.sort((a, b) => (a.added - b.added));
      parsedResult.currentPoll.participants = participants.map((a) => ({
        personName: a.person,
        friendName: (a.friend == '/') ? '' : a.friend
      }));

      // all names
      var newNames = {};
      var oldNames = {};
      jsonResult.participants.forEach(function (a) { newNames[a.person] = null }); // remove duplicates
      jsonResult.persons.forEach(function (a) { oldNames[a.name] = null });
      parsedResult.allNames = {
        newNames: newNames,
        oldNames: oldNames,
      };

      // stats
      var playedGames = [];
      var invitedFriends = [];
      jsonResult.persons.forEach(function (a) {
        var polls = parseInt(a.polls);
        if (polls > 0)
          playedGames.push({ name: a.name, polls: polls });

        var friends = parseInt(a.friends);
        if (friends > 0)
          invitedFriends.push({ name: a.name, friends: friends });
      });
      playedGames.sort((a, b) => (b.polls - a.polls));
      invitedFriends.sort((a, b) => (b.friends - a.friends));
      parsedResult.participantsStats = {
        playedGames: playedGames,
        invitedFriends: invitedFriends,
      };

      // old polls
      oldPolls.sort((a, b) => (b.info.pollId - a.info.pollId));
      parsedResult.oldPolls.polls = oldPolls;
      parsedResult.oldPolls.oldestPollId = oldPolls[oldPolls.length - 1].info.pollId;

      successCallback(parsedResult);

    }).catch(function (error) {
      errorCallback(error.response.status, error.response.data);
    });

  };

  var getPollParticipants = function (pollId, callback) {
    var result = `
      {
        "statusCode": 200,
        "body": {
          "participants": [
            {
              "poll": 34,
              "friend": "/",
              "added": 1566514800000,
              "person": "мето"
            },
            {
              "poll": 34,
              "friend": "/",
              "added": 1566518400000,
              "person": "gercho"
            },
            {
              "poll": 34,
              "friend": "/",
              "added": 1566522000000,
              "person": "marjan"
            },
            {
              "poll": 34,
              "friend": "/",
              "added": 1566525600000,
              "person": "blagoja"
            },
            {
              "poll": 34,
              "friend": "+1",
              "added": 1566529200000,
              "person": "marjan"
            },
            {
              "poll": 34,
              "friend": "/",
              "added": 1566532800000,
              "person": "radic"
            },
            {
              "poll": 34,
              "friend": "/",
              "added": 1566536400000,
              "person": "stevan"
            },
            {
              "poll": 34,
              "friend": "+1 petar",
              "added": 1566540000000,
              "person": "stevan"
            },
            {
              "poll": 34,
              "friend": "никола",
              "added": 1566543600000,
              "person": "мето"
            },
            {
              "poll": 34,
              "friend": "+1",
              "added": 1566547200000,
              "person": "srdjan"
            },
            {
              "poll": 34,
              "friend": "robe",
              "added": 1566550800000,
              "person": "srdjan"
            },
            {
              "poll": 34,
              "friend": "aco",
              "added": 1566554400000,
              "person": "srdjan"
            }
          ]
        }
      }
    `
    var jsonResult = JSON.parse(result);
    var participants = jsonResult.body.participants;
    participants.sort((a, b) => (a.added - b.added));
    var parsedResult = participants.map((a) => ({
      personName: a.person,
      friendName: (a.friend == '/') ? '' : a.friend
    }));

    // callback(parsedResult)
    setTimeout(() => callback(parsedResult), 5000);
  };

  global.API = {
    getSiteData: getSiteData,
    getPollParticipants: getPollParticipants,
  };

}(this));