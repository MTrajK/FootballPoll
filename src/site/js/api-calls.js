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

  var getSiteData = function (callback) {
    var result = `
        {
            "statusCode": 200,
            "body": {
              "current_poll": 34,
              "polls": [
                {
                  "dt": 1565894400000,
                  "max": 14,
                  "note": "/",
                  "need": 12,
                  "end": 1565906400000,
                  "locUrl": "https://goo.gl/maps/aivZ5cdPEpz",
                  "id": 31,
                  "start": 1565301600000,
                  "title": "Фудбал-INSCALE",
                  "locDesc": "ОУ Блаже Конески Аеродром"
                },
                {
                  "dt": 1566499200000,
                  "max": 14,
                  "note": "/",
                  "need": 12,
                  "end": 1566511200000,
                  "locUrl": "https://goo.gl/maps/aivZ5cdPEpz",
                  "id": 32,
                  "start": 1565906400000,
                  "title": "Фудбал-INSCALE",
                  "locDesc": "ОУ Блаже Конески Аеродром"
                },
                {
                  "dt": 1567104000000,
                  "max": 14,
                  "note": "/",
                  "need": 12,
                  "end": 1567116000000,
                  "locUrl": "https://goo.gl/maps/aivZ5cdPEpz",
                  "id": 33,
                  "start": 1566511200000,
                  "title": "Фудбал-INSCALE",
                  "locDesc": "ОУ Блаже Конески Аеродром"
                },
                {
                  "dt": 1567708800000,
                  "max": 14,
                  "note": "/",
                  "need": 12,
                  "end": 1567720800000,
                  "locUrl": "https://goo.gl/maps/aivZ5cdPEpz",
                  "id": 34,
                  "start": 1567116000000,
                  "title": "Фудбал-INSCALE",
                  "locDesc": "ОУ Блаже Конески Аеродром"
                }
              ],
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
              ],
              "persons": [
                {
                  "polls": 15,
                  "friends": 12,
                  "name": "викса"
                },
                {
                  "polls": 11,
                  "friends": 10,
                  "name": "marjan"
                },
                {
                  "polls": 1,
                  "friends": 0,
                  "name": "zlatko"
                },
                {
                  "polls": 7,
                  "friends": 4,
                  "name": "никола"
                },
                {
                  "polls": 11,
                  "friends": 0,
                  "name": "dimitar"
                },
                {
                  "polls": 5,
                  "friends": 0,
                  "name": "vili"
                },
                {
                  "polls": 2,
                  "friends": 5,
                  "name": "иван"
                },
                {
                  "polls": 25,
                  "friends": 11,
                  "name": "мето"
                },
                {
                  "polls": 14,
                  "friends": 38,
                  "name": "srdjan"
                },
                {
                  "polls": 1,
                  "friends": 0,
                  "name": "kristijan"
                },
                {
                  "polls": 1,
                  "friends": 0,
                  "name": "viktor s"
                },
                {
                  "polls": 17,
                  "friends": 0,
                  "name": "bojan"
                },
                {
                  "polls": 2,
                  "friends": 0,
                  "name": "tasko"
                },
                {
                  "polls": 1,
                  "friends": 0,
                  "name": "robert"
                },
                {
                  "polls": 2,
                  "friends": 0,
                  "name": "petar"
                },
                {
                  "polls": 1,
                  "friends": 0,
                  "name": "aleksandar nedevski"
                },
                {
                  "polls": 6,
                  "friends": 0,
                  "name": "nikola kicev"
                },
                {
                  "polls": 14,
                  "friends": 0,
                  "name": "gercho"
                },
                {
                  "polls": 1,
                  "friends": 0,
                  "name": "jovan j"
                },
                {
                  "polls": 27,
                  "friends": 28,
                  "name": "stevan"
                },
                {
                  "polls": 20,
                  "friends": 27,
                  "name": "gjorgi"
                },
                {
                  "polls": 15,
                  "friends": 1,
                  "name": "mitko"
                },
                {
                  "polls": 4,
                  "friends": 1,
                  "name": "goran t"
                },
                {
                  "polls": 3,
                  "friends": 0,
                  "name": "bujo"
                },
                {
                  "polls": 9,
                  "friends": 0,
                  "name": "blagoja"
                },
                {
                  "polls": 2,
                  "friends": 0,
                  "name": "enes"
                },
                {
                  "polls": 28,
                  "friends": 25,
                  "name": "radic"
                },
                {
                  "polls": 1,
                  "friends": 0,
                  "name": "alen"
                }
              ]
            }
          }
        `;
    var jsonResult = JSON.parse(result);
    var parsedResult = {
      currentPoll: {
        info: {},
        editedInfo: {},
        participants: [],
      }
    };

    var currentPoll = jsonResult.body.current_poll;
    var allPolls = jsonResult.body.polls;
    for (var i = 0; i < allPolls.length; i++) {
      if (allPolls[i].id == currentPoll) {
        parsedResult.currentPoll.info = {
          title: allPolls[i].title,
          note: allPolls[i].note,
          locationDescription: allPolls[i].locDesc,
          locationURL: allPolls[i].locUrl,
          needPlayers: parseInt(allPolls[i].need),
          maxPlayers: parseInt(allPolls[i].max),
          dayTime: parseInt(allPolls[i].dt),
          endDate: parseInt(allPolls[i].end),
          startDate: parseInt(allPolls[i].start),
          pollId: parseInt(allPolls[i].id),
        }
        break;
      }
    }

    if (parsedResult.currentPoll.info.note == "/")
      parsedResult.currentPoll.info.note = "";
    // create a deep copy/clone of that object (or use JSON.parse(JSON.stringify(object)))
    parsedResult.currentPoll.editedInfo = {
      title: parsedResult.currentPoll.info.title,
      note: parsedResult.currentPoll.info.note,
      locationDescription: parsedResult.currentPoll.info.locationDescription,
      locationURL: parsedResult.currentPoll.info.locationURL,
      needPlayers: parsedResult.currentPoll.info.needPlayers,
      maxPlayers: parsedResult.currentPoll.info.maxPlayers,
    };

    callback(parsedResult);
  };

  global.API =
    {
      getSiteData: getSiteData,
    };

}(this));