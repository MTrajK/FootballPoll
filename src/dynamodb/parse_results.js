// CSV format of all results from doodle_results.xlsx
var csvResults = "Мето,Мето,Gjorgi,Gjorgi,Мето,Radic,Викса,Мето,Викса,Gjorgi,Мето,Gjorgi,Мето,Srdjan,Stevan,Никола,Gercho,Radic,Dimitar,Radic (Filip),Dimitar,Radic,Stevan,Gjorgi,Stevan,Radic,Mitko,Radic,Radic,Викса,Викса,Marjan (Goce),Dimitar,Викса,Jovan J,Викса,Викса,Мето,Dimitar,Stevan,Marjan (Goce),Alen,Иван,Gjorgi,Radic (Nikola),Radic (Goce),Radic,Viktor S,Никола,Srdjan,Vili,Gercho,Radic,Gercho,Bojan,Викса (+1),Gjorgi (+1),Srdjan (Aco),Srdjan (Aco),Викса (+1),Mitko,Mitko,Enes,Викса,Иван,Викса,Radic (Tino),Gjorgi (+1),Никола,Мето (+1),Мето (Ivan),Srdjan (Robe),Викса (+2),Srdjan,Мето,Bujo,Gercho,Marjan,Никола,Мето (+1),Gjorgi (+2),Никола (+1),Bojan,Иван (Дејан Младенов),Radic (TIno),Мето (+1),Stevan,Radic,Radic,Викса (Дамјан),Marjan (Goce),Bojan,Srdjan (Robe),Gjorgi (+3),Gjorgi (+1),Викса (+1),Radic (+1),Викса (+1),Petar,Srdjan (Robe),Викса (+1),Marjan (Goce),Marjan (Goce),Marjan (Ivan),Dimitar,Srdjan (Ace),Stevan,Gjorgi (+2),Gjorgi (+2),Radic (+2),Radic (Pero),Srdjan (Aco),Мето,Gjorgi (+1),Gjorgi (+1),Srdjan (Aco),Иван (Аце),Gjorgi,Stevan (Filip),Никола (+1),Stevan,Srdjan (Aco),Иван (Мето Јанакиевски),Radic (Ivan),Radic (+1),Petar,Gjorgi (+2),Srdjan (+1),Мето (Никола),Srdjan (Aco),Gercho,Stevan (+1),Radic (Ivan),Иван (+1),Srdjan (Robe),Radic (+3),Викса (+2),Radic (+2),Kristijan,Gjorgi (+3),Radic (Nikola),Мето (Иван),Srdjan (Robe),Vili,Stevan (+2),Никола (+2 Томче),Bojan,Gjorgi (+3),Radic (+4),Мето (Nikola),Radic (+3),Stevan (+1),Викса (+2),Radic (Tino),Marjan,Иван (Никола)";
var allPlayers = csvResults.split(",");

// get the unique names
var namesDict = {};

for (var i=0; i<allPlayers.length; i++) {
	var findBracket = allPlayers[i].indexOf("(");

	if (findBracket === -1) {
		namesDict[allPlayers[i]] = true;
	} else {
		namesDict[allPlayers[i].substring(0, findBracket - 1)] = true;
	}
}

var uniqueNames = Object.keys(namesDict);

// get the statistics for all players
var playedCount = {};
var friendsCount = {};

for (var i=0; i<uniqueNames.length; i++) {
	playedCount[uniqueNames[i]] = 0;
	friendsCount[uniqueNames[i]] = 0;
}

for (var i=0; i<allPlayers.length; i++) {
	var findBracket = allPlayers[i].indexOf("(");

	if (findBracket === -1) {
		playedCount[allPlayers[i]] ++;
	} else {
		friendsCount[allPlayers[i].substring(0, findBracket - 1)] ++;
	}
}

// show stats
var playersStats = "";

for (var i=0; i<uniqueNames.length; i++) {
	playersStats += uniqueNames[i] + "\t";
	playersStats += playedCount[uniqueNames[i]] + "\t";
	playersStats += friendsCount[uniqueNames[i]] + "\n";
}

console.log("Name\tPlayed\tFriends")
console.log(playersStats);