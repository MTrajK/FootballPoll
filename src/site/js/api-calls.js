(function (global) {

  var apiURL = 'https://v0u768t0yk.execute-api.eu-central-1.amazonaws.com/v1/';
  // apiKey is used only to limit the quota of the API calls 
  // (with this key, this app is allowed to make 500 requests daily)
  var apiKey = {'x-api-key': 'HqX2gUHiTd9Cu0XYmOorZ5doUUGOl3JqamoPl37H'};
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

  var sortParticipants = function (participants) {
    participants.sort(function (a, b) { return a.added - b.added; });

    var sortedParticipants = participants.map(function (a) {
      return {
        personName: a.person,
        friendName: (a.friend == '/') ? '' : a.friend,
        participantId: a.added
      };
    });

    return sortedParticipants;
  };

  var parseAndSortPolls = function (polls) {
    var parsedPolls = polls.map(function (a) {
      return {
        info: parsePoll(a),
        participants: undefined,
      }
    });

    parsedPolls.sort(function (a, b) { return b.info.pollId - a.info.pollId; });

    return {
      polls: parsedPolls,
      oldestPollId: parsedPolls[parsedPolls.length - 1].info.pollId
    }
  };

  var errorHandling = function (error, errorCallback) {
    var status = 500;
    var message = error.message;

    if (error.response !== undefined) {
      if (error.response.status !== undefined)
        status = error.response.status;

      if ((error.response.data !== undefined) && (error.response.data.errorMessage !== undefined))
        message = error.response.data.errorMessage;
    }
    errorCallback(status, message);
  };

  var getSiteData = function (successCallback, errorCallback) {

    axios({
      method: 'get',
      url: apiURL + 'get-site-data',
      timeout: maxRequestTime,
      headers: apiKey
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

      // current poll and old polls info
      var allPolls = parseAndSortPolls(jsonResult.polls);
      parsedResult.currentPoll.info = allPolls.polls.splice(0, 1)[0].info; // remove current poll from the old polls
      parsedResult.oldPolls = allPolls;

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
      parsedResult.currentPoll.participants = sortParticipants(jsonResult.participants);

      // all names
      var newNames = {};
      var oldNames = {};
      jsonResult.participants.forEach(function (a) { newNames[a.person] = null; }); // remove duplicates
      jsonResult.persons.forEach(function (a) { oldNames[a.name] = null; });
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
      playedGames.sort(function (a, b) { return b.polls - a.polls; });
      invitedFriends.sort(function (a, b) { return b.friends - a.friends; });
      parsedResult.participantsStats = {
        playedGames: playedGames,
        invitedFriends: invitedFriends,
      };

      successCallback(parsedResult);

    }).catch(function (error) {

      errorHandling(error, errorCallback);

    });

  };

  var getPollParticipants = function (pollId, successCallback, errorCallback) {

    axios({
      method: 'get',
      url: apiURL + 'get-poll-participants',
      timeout: maxRequestTime,
      params: {
        'poll_id': parseInt(pollId)
      },
      headers: apiKey
    }).then(function (response) {

      var sortedParticipants = sortParticipants(response.data);
      successCallback(sortedParticipants);

    }).catch(function (error) {

      errorHandling(error, errorCallback);

    });

  };

  var getOldPolls = function (lastPoll, successCallback, errorCallback) {

    axios({
      method: 'get',
      url: apiURL + 'get-old-polls',
      timeout: maxRequestTime,
      params: {
        'last_poll': parseInt(lastPoll)
      },
      headers: apiKey
    }).then(function (response) {

      var sortedAndParsedPolls = parseAndSortPolls(response.data);
      successCallback(sortedAndParsedPolls);

    }).catch(function (error) {

      errorHandling(error, errorCallback);

    });

  };

  var updateCurrentPoll = function (updatedInfo, successCallback, errorCallback) {

    var mappings = {
      'note': 'note',
      'title': 'title',
      'locationURL': 'locUrl',
      'locationDescription': 'locDesc',
      'maxPlayers': 'max',
      'needPlayers': 'need',
      'endDate': 'end',
      'dayTime': 'dt',
      'name': 'admin_name',
      'password': 'admin_password'
    };
    var data = {};
    Object.keys(updatedInfo).forEach(function (a) { data[mappings[a]] = updatedInfo[a]; })

    axios({
      method: 'put',
      url: apiURL + 'update-current-poll',
      timeout: maxRequestTime,
      data: data,
      headers: apiKey
    }).then(function (response) {

      successCallback();

    }).catch(function (error) {

      errorHandling(error, errorCallback);

    });

  };

  var addParticipant = function (participant, successCallback, errorCallback) {

    axios({
      method: 'post',
      url: apiURL + 'add-participant',
      timeout: maxRequestTime,
      data: participant,
      headers: apiKey
    }).then(function (response) {

      successCallback(response.data['added']);

    }).catch(function (error) {

      errorHandling(error, errorCallback);

    });

  };

  var deleteParticipant = function (participant, successCallback, errorCallback) {

    axios({
      method: 'delete',
      url: apiURL + 'delete-participant',
      timeout: maxRequestTime,
      data: participant,
      headers: apiKey
    }).then(function (response) {

      successCallback();

    }).catch(function (error) {

      errorHandling(error, errorCallback);

    });

  };

  global.API = {
    getSiteData: getSiteData,
    getPollParticipants: getPollParticipants,
    getOldPolls: getOldPolls,
    updateCurrentPoll: updateCurrentPoll,
    addParticipant: addParticipant,
    deleteParticipant: deleteParticipant
  };

}(this));