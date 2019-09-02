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
              "participants": [],
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

        callback(jsonResult);
    };

    global.API = 
    {
        getSiteData: getSiteData,
    };

}(this));