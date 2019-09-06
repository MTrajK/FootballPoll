new Vue({
    el: '#app',
    data: {
        UIBindings: {
            showPollInfo: true,
            savingPollInfo: false,
            updatingPollParticipants: false,
            loadingOldPolls: false,
            loadingOldPollInfo: false,
            showOldPollInfo: false,
            wrongAdminCredentials: false,
        },
        adminCredentials: {
            name: '',
            password: '',
        },
        addPollParticipantForm: {
            personName: '',
            friendName: '',
        },
        currentPoll: {
            info: {
                title: undefined,
                note: undefined,
                locationDescription: undefined,
                locationURL: undefined,
                needPlayers: undefined,
                maxPlayers: undefined,
                dayTime: undefined,
                endDate: undefined,
                startDate: undefined,
                pollId: undefined,
            },
            editInfo: {
                title: undefined,
                note: undefined,
                locationDescription: undefined,
                locationURL: undefined,
                needPlayers: undefined,
                maxPlayers: undefined,
            },
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
            polls: [ /* { info: {}, participants: [] } */],
        },
    },
    mounted: function () {
        /**
        * Init UI components and get the data needed for the app, after everything from the dom is rendered
        */

        this.$nextTick(function () {
            var thisApp = this;

            // Init scrolspy
            M.ScrollSpy.init(document.querySelectorAll('.scrollspy'));

            // Init autocomplete for names
            UIComponents.nameAutocomplete = M.Autocomplete.init(document.querySelector('#name-autocomplete'), {
                onAutocomplete: function () {
                    // bug in materialize or vue, bind manually this value...
                    thisApp.addPollParticipantForm.personName = UIComponents.nameAutocomplete.el.value;
                }
            });

            // Init time/date pickers
            UIComponents.pickers.timePicker = M.Timepicker.init(
                document.querySelector('#time-input'), {
                    'twelveHour': false,
                    'autoClose': true
                }
            );
            UIComponents.pickers.dayPicker = M.Datepicker.init(
                document.querySelector('#day-input'), {
                    'format': 'dddd (dd.mm.yyyy)',
                    'autoClose': true
                }
            );
            UIComponents.pickers.endDatePicker = M.Datepicker.init(
                document.querySelector('#end-date-input'), {
                    'format': 'dddd (dd.mm.yyyy)',
                    'autoClose': true
                }
            );

            // Init modals
            UIComponents.modals.saveInfoModal = M.Modal.init(document.querySelector('#save-info-modal'), {
                onCloseStart: function () {
                    thisApp.adminCredentials.name = '';
                    thisApp.adminCredentials.password = '';
                    UIComponents.labels.saveInfoAdminName.classList.remove('active');
                    UIComponents.labels.saveInfoAdminPassword.classList.remove('active');
                    thisApp.UIBindings.wrongAdminCredentials = false;
                },
                onOpenEnd: function () {
                    UIComponents.labels.saveInfoAdminName.focus();
                }
            });
            UIComponents.modals.showStatsModal = M.Modal.init(document.querySelector('#show-stats-modal'));
            UIComponents.modals.showOldPollModal = M.Modal.init(document.querySelector('#show-old-poll-modal'), {
                onCloseEnd: function () {
                    thisApp.UIBindings.showOldPollInfo = false;
                }
            });

            // Save label elements
            UIComponents.labels.saveInfoAdminName = document.querySelector('#save-info-admin-name-label');
            UIComponents.labels.saveInfoAdminPassword = document.querySelector('#save-info-admin-password-label');
            UIComponents.labels.addParticipantName = document.querySelector('#name-autocomplete-label');
            UIComponents.labels.addParticipantFriend = document.querySelector('#friend-input-label');
            UIComponents.labels.editInfoTitle = document.querySelector('#title-input-label');
            UIComponents.labels.editInfoNote = document.querySelector('#note-input-label');
            UIComponents.labels.editInfoLocDesc = document.querySelector('#loc-desc-input-label');
            UIComponents.labels.editInfoLocUrl = document.querySelector('#loc-url-input-label');
            UIComponents.labels.editInfoNeed = document.querySelector('#need-input-label');
            UIComponents.labels.editInfoMax = document.querySelector('#max-input-label');
            UIComponents.labels.editInfoTime = document.querySelector('#time-input-label');
            UIComponents.labels.editInfoDay = document.querySelector('#day-input-label');
            UIComponents.labels.editInfoEndDate = document.querySelector('#end-date-input-label');

            // Get site data
            API.getSiteData(
                function (results) {
                    // update data
                    thisApp.currentPoll = results.currentPoll;
                    thisApp.allNames = results.allNames;
                    thisApp.participantsStats = results.participantsStats;
                    thisApp.oldPolls = results.oldPolls;

                    // update autocomplete
                    thisApp.updateAutocomplete();

                    // update pickers
                    thisApp.updatePickers();

                    // update page title
                    document.title = thisApp.currentPoll.info.title;

                    // show the latest added name as suggestion
                    var lastAddedName = localStorage.getItem('FootballPoll.lastAdded');
                    if (lastAddedName !== null)
                        thisApp.addPollParticipantForm.personName = thisApp.capitalizeFirstLetters(lastAddedName);

                    // Remove the main spinner after all of the content is loaded
                    // DON'T USE VUE FOR THE MAIN SPINNER!
                    document.querySelector('#main-spinner').remove();
                    document.body.classList.remove('spinner-loading');

                    // update labels for the input fields (materialize bug)
                    if (thisApp.currentPoll.editInfo.note !== '')
                        UIComponents.labels.editInfoNote.classList.add('active');   // only this field can be empty
                    UIComponents.labels.editInfoTitle.classList.add('active');
                    UIComponents.labels.editInfoLocDesc.classList.add('active');
                    UIComponents.labels.editInfoLocUrl.classList.add('active');
                    UIComponents.labels.editInfoNeed.classList.add('active');
                    UIComponents.labels.editInfoMax.classList.add('active');
                    UIComponents.labels.editInfoTime.classList.add('active');
                    UIComponents.labels.editInfoDay.classList.add('active');
                    UIComponents.labels.editInfoEndDate.classList.add('active');

                    // focus on adding player input
                    UIComponents.labels.addParticipantName.focus();
                    if (thisApp.addPollParticipantForm.personName !== '')
                        UIComponents.labels.addParticipantName.add('active'); // just in case this
                },
                function (status, message) {
                    document.querySelector('#spinning-part').remove();
                    document.querySelector('#error-info-text').style.display = 'block';
                    document.querySelector('#main-spinner').style.cursor = 'default';
                }
            );

        })
    },
    watch: {
        'addPollParticipantForm.personName': function (newValue) {
            var allParts = newValue.split(/\s+/);

            for (var i = 0; i < allParts.length; i++)
                allParts[i] = allParts[i].replace(/[^a-zA-ZабвгдѓежзѕијклљмнњопрстќуфхцчџшАБВГДЃЕЖЗЅИЈКЛЉМНЊОПРСТЌУФХЦЧЏШ0-9]+/g, '');

            var result = allParts.join(' ');
            if (result[0] === ' ')
                result = result.slice(1);

            this.addPollParticipantForm.personName = result;
        },
        'addPollParticipantForm.friendName': function (newValue) {
            var allParts = newValue.split(/\s+/);

            for (var i = 0; i < allParts.length; i++)
                allParts[i] = allParts[i].replace(/[^a-zA-ZабвгдѓежзѕијклљмнњопрстќуфхцчџшАБВГДЃЕЖЗЅИЈКЛЉМНЊОПРСТЌУФХЦЧЏШ0-9+]+/g, '');

            var result = allParts.join(' ');
            if (result[0] === ' ')
                result = result.slice(1);

            this.addPollParticipantForm.friendName = result;
        }
    },
    computed: {
        disableAddButton: function () {
            if (this.currentPoll.participants.length >= parseInt(this.currentPoll.info.maxPlayers))
                return true;

            var personName = this.addPollParticipantForm.personName;
            var friendName = this.addPollParticipantForm.friendName;

            if ((personName === undefined) || (friendName === undefined) || (personName === ''))
                return true;

            if (friendName !== '')
                return false;

            personName = personName.toLowerCase();
            for (var i = 0; i < this.currentPoll.participants.length; i++)
                if ((this.currentPoll.participants[i].personName === personName) &&
                    (this.currentPoll.participants[i].friendName === ''))
                    return true;

            return false;
        },
        disableLoadMoreButton: function () {
            return this.UIBindings.loadingOldPolls || (this.oldPolls.oldestPollId === 0);
        },
        disableSaveButton: function () {
            return (this.adminCredentials.name === '') || (this.adminCredentials.password === '');
        }
    },
    methods: {

        /******************************
        **         API CALLS         **
        ******************************/

        savePollInfo: function () {
            this.UIBindings.savingPollInfo = true;
            UIComponents.modals.saveInfoModal.options.dismissible = false;

            var updatedProperties = this.findUpdatedInfoProperties();
            updatedProperties['name'] = this.adminCredentials.name;
            updatedProperties['password'] = this.adminCredentials.password;

            var thisApp = this;
            API.updateCurrentPoll(
                updatedProperties,
                function () {
                    if ((updatedProperties['note'] !== undefined) && (updatedProperties['note'] === '/'))
                        updatedProperties['note'] = '';

                    // update in the poll info view
                    Object.keys(updatedProperties).forEach(function (propertyName) {
                        thisApp.currentPoll.info[propertyName] = updatedProperties[propertyName];
                    });

                    if (thisApp.currentPoll.info.title !== document.title)
                        // update page title
                        document.title = thisApp.currentPoll.info.title;

                    thisApp.UIBindings.showPollInfo = true;
                    UIComponents.modals.saveInfoModal.close();
                    thisApp.UIBindings.savingPollInfo = false;
                    UIComponents.modals.saveInfoModal.options.dismissible = true;
                    M.toast({ html: 'The poll info is updated!' });
                },
                function (status, message) {
                    if (status === 400) {
                        UIComponents.modals.saveInfoModal.close();
                        UIComponents.modals.saveInfoModal.options.dismissible = true;
                        M.toast({ html: `Something in the updated values is wrong! Error message: ${message}` });
                    } else if (status === 403) {
                        thisApp.adminCredentials.name = '';
                        thisApp.adminCredentials.password = '';
                        UIComponents.labels.saveInfoAdminName.classList.remove('active');
                        UIComponents.labels.saveInfoAdminPassword.classList.remove('active');
                        thisApp.UIBindings.wrongAdminCredentials = true;
                    } else {
                        UIComponents.modals.saveInfoModal.close();
                        UIComponents.modals.saveInfoModal.options.dismissible = true;
                        M.toast({ html: `Can\'t save the updated info! Error message: ${message}` });
                    }
                    thisApp.UIBindings.savingPollInfo = false;
                }
            );
        },
        addPollParticipant: function () {
            this.UIBindings.updatingPollParticipants = true;

            var personName = this.addPollParticipantForm.personName.toLowerCase();
            var friendName = this.addPollParticipantForm.friendName.toLowerCase();

            var participant = {
                'person': personName
            };
            if (friendName !== '')
                participant['friend'] = friendName;

            var thisApp = this;
            API.addParticipant(
                participant,
                function (participantId) {
                    thisApp.currentPoll.participants.push({
                        personName: personName,
                        friendName: friendName,
                        participantId: participantId
                    });

                    // save this name to browser's storage
                    localStorage.setItem('FootballPoll.lastAdded', personName);

                    thisApp.addPollParticipantForm.personName = '';
                    thisApp.addPollParticipantForm.friendName = '';

                    UIComponents.labels.addParticipantName.classList.remove('active');
                    UIComponents.labels.addParticipantFriend.classList.remove('active');

                    thisApp.UIBindings.updatingPollParticipants = false;

                    thisApp.allNames.newNames[personName] = null;
                    thisApp.updateAutocomplete();

                    var fullName = thisApp.capitalizeFirstLetters(personName);
                    if (friendName !== '')
                        fullName += ` (${friendName})`;

                    M.toast({ html: `${fullName} is added to the poll!` });
                },
                function (status, message) {
                    thisApp.UIBindings.updatingPollParticipants = false;
                    M.toast({ html: `Can\'t add the participant! Error message: ${message}` });
                }
            );
        },
        deletePollParticipant: function (deletedIndex) {
            this.UIBindings.updatingPollParticipants = true;

            var thisApp = this;
            API.deleteParticipant(
                { 'participant_id': this.currentPoll.participants[deletedIndex].participantId },
                function () {
                    var personName = thisApp.currentPoll.participants[deletedIndex].personName;
                    var friendName = thisApp.currentPoll.participants[deletedIndex].friendName;
                    thisApp.currentPoll.participants.splice(deletedIndex, 1);

                    if ((thisApp.allNames.oldNames[personName] !== null) && (thisApp.allNames.newNames[personName] === null)) {
                        var found = false;

                        for (var i = 0; i < thisApp.currentPoll.participants.length; i++)
                            if (thisApp.currentPoll.participants[i].personName === personName) {
                                found = true;
                                break;
                            }

                        if (!found) {
                            // update the autocomplete if the person doesn't exist anymore
                            delete thisApp.allNames.newNames[personName];
                            thisApp.updateAutocomplete();
                        }
                    }

                    thisApp.UIBindings.updatingPollParticipants = false;

                    var fullName = thisApp.capitalizeFirstLetters(personName);
                    if (friendName !== '')
                        fullName += ` (${friendName})`;

                    M.toast({ html: `${fullName} is deleted from the poll!` });
                },
                function (status, message) {
                    thisApp.UIBindings.updatingPollParticipants = false;
                    M.toast({ html: `Can\'t delete the participant! Error message: ${message}` });
                }
            );
        },
        loadOldPolls: function () {
            this.UIBindings.loadingOldPolls = true;

            var thisApp = this;
            API.getOldPolls(
                this.oldPolls.oldestPollId,
                function (oldPolls) {
                    oldPolls.polls.forEach(function (a) { thisApp.oldPolls.polls.push(a); });
                    thisApp.oldPolls.oldestPollId = oldPolls.oldestPollId;
                    thisApp.UIBindings.loadingOldPolls = false;
                    /*
                    // scroll to bottom (think about this)
                    setTimeout(function() {
                        window.scrollTo(0, document.body.scrollHeight);
                    }, 100);
                    */
                },
                function (status, message) {
                    M.toast({ html: `Can\'t load the older polls! Error message: ${message}` });
                    thisApp.UIBindings.loadingOldPolls = false;
                }
            );
        },
        loadOldPollInfo: function (selectedPollIdx) {
            this.UIBindings.loadingOldPollInfo = true;
            UIComponents.modals.showOldPollModal.options.dismissible = false;

            this.oldPolls.selectedPollIdx = selectedPollIdx;

            if (this.oldPolls.polls[selectedPollIdx].participants === undefined) {
                var thisApp = this;
                API.getPollParticipants(
                    this.oldPolls.polls[selectedPollIdx].info.pollId,
                    function (participants) {
                        thisApp.oldPolls.polls[selectedPollIdx].participants = participants;
                        thisApp.loadedOldPollInfo();
                    },
                    function (status, message) {
                        UIComponents.modals.showOldPollModal.close();
                        M.toast({ html: `Can\'t load the poll info! Error message: ${message}` });
                    }
                );
            } else {
                this.loadedOldPollInfo();
            }
        },


        /******************************
        **       HELP METHODS        **
        ******************************/

        editPollInfo: function () {
            this.UIBindings.showPollInfo = false;
        },
        cancelEditingPollInfo: function () {
            this.UIBindings.showPollInfo = true;

            this.currentPoll.editInfo.title = this.currentPoll.info.title;
            this.currentPoll.editInfo.note = this.currentPoll.info.note;
            this.currentPoll.editInfo.locationDescription = this.currentPoll.info.locationDescription;
            this.currentPoll.editInfo.locationURL = this.currentPoll.info.locationURL;
            this.currentPoll.editInfo.needPlayers = this.currentPoll.info.needPlayers;
            this.currentPoll.editInfo.maxPlayers = this.currentPoll.info.maxPlayers;
            this.currentPoll.editInfo.note = this.currentPoll.info.note;
            this.updatePickers();

            UIComponents.labels.editInfoNote.classList.remove('active');
        },
        formatDate: function (milliseconds) {
            var date = new Date(milliseconds);
            if (date.toDateString() === 'Invalid Date')
                return '';

            var day = `${date.getDate()}`;
            var month = `${date.getMonth() + 1}`;
            var year = date.getFullYear();

            if (day < 10)
                day = `0${day}`;
            if (month < 10)
                month = `0${month}`;

            return `${day}.${month}.${year}`;
        },
        formatTime: function (milliseconds) {
            var date = new Date(milliseconds);
            if (date.toDateString() === 'Invalid Date')
                return '';

            var hours = date.getHours();
            var minutes = date.getMinutes();

            if (hours < 10)
                hours = `0${hours}`;
            if (minutes < 10)
                minutes = `0${minutes}`;

            return `${hours}:${minutes}`;
        },
        formatDayDate: function (milliseconds) {
            var date = new Date(milliseconds);
            if (date.toDateString() === 'Invalid Date')
                return '';

            var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
            var formattedDate = this.formatDate(milliseconds);

            return `${weekday} (${formattedDate})`;
        },
        formatTimeDate: function (milliseconds) {
            return `${this.formatTime(milliseconds)} ${this.formatDate(milliseconds)}`;
        },
        capitalizeFirstLetters: function (name) {
            var splitted = name.split(/\s+/);

            for (var i = 0; i < splitted.length; i++)
                splitted[i] = splitted[i][0].toUpperCase() + splitted[i].slice(1);

            return splitted.join(' ');
        },
        showFriendName: function (name) {
            return name !== '';
        },
        loadedOldPollInfo: function () {
            this.UIBindings.showOldPollInfo = true;
            this.UIBindings.loadingOldPollInfo = false;
            UIComponents.modals.showOldPollModal.options.dismissible = true;
        },
        showPollNote: function (pollNote) {
            return (pollNote !== undefined) && (pollNote !== '');
        },
        checkIfGrt: function (number, comapreWith) {
            return number > comapreWith;
        },
        calculateColor: function (total, need, max) {
            need = parseInt(need);
            max = parseInt(max);

            if ((need === undefined) || (max === undefined) || (total > max))
                return {};

            var red = [229, 57, 53]; // #e53935
            var green = [124, 179, 66]; // #7cb342

            var percentage = total / need;
            if (total > need)
                percentage = 1 - (total - need) / (max - need) * 0.5;

            var newColor = '#';
            for (var i = 0; i < 3; i++)
                // interpolate between colors
                newColor += Math.round(red[i] + (green[i] - red[i]) * percentage).toString(16);

            return {
                backgroundColor: newColor
            };
        },
        updatePickers: function () {
            UIComponents.pickers.dayPicker.setDate(new Date(this.currentPoll.info.dayTime));
            UIComponents.pickers.dayPicker._finishSelection();

            UIComponents.pickers.endDatePicker.setDate(new Date(this.currentPoll.info.endDate));
            UIComponents.pickers.endDatePicker._finishSelection();

            UIComponents.pickers.timePicker.$el[0].value = this.formatTime(this.currentPoll.info.dayTime);
            UIComponents.pickers.timePicker._updateTimeFromInput();
        },
        updateAutocomplete: function () {
            var result = {};
            var thisApp = this;
            var func = function (name) { result[thisApp.capitalizeFirstLetters(name)] = null };

            // capitalize first letters for all names in the autocomplete list
            Object.keys(this.allNames.oldNames).forEach(func);
            Object.keys(this.allNames.newNames).forEach(func);

            UIComponents.nameAutocomplete.updateData(result);
        },
        openSaveInfoModal: function () {
            if (Object.keys(this.findUpdatedInfoProperties()).length === 0)
                M.toast({ html: 'There are no changes in the poll info!' });
            else
                UIComponents.modals.saveInfoModal.open();
        },
        findUpdatedInfoProperties: function () {
            var thisApp = this;
            var updateProperties = {};

            Object.keys(this.currentPoll.editInfo).forEach(function (propertyName) {
                // save property name and value if there is difference
                if (thisApp.currentPoll.info[propertyName] !== thisApp.currentPoll.editInfo[propertyName])
                    updateProperties[propertyName] = thisApp.currentPoll.editInfo[propertyName];
            });

            // calculate values for dayTime and endTime (from the pickers)
            var millisecondsFromTime = UIComponents.pickers.timePicker.hours * 3600000 + UIComponents.pickers.timePicker.minutes * 60000;
            var dayTime = UIComponents.pickers.dayPicker.date.getTime() + millisecondsFromTime;
            var endDate = UIComponents.pickers.endDatePicker.date.getTime();

            if (this.currentPoll.info.dayTime !== dayTime)
                updateProperties['dayTime'] = dayTime;
            if (this.currentPoll.info.endDate !== endDate)
                updateProperties['endDate'] = endDate;

            if (updateProperties['needPlayers'] !== undefined)
                updateProperties['needPlayers'] = parseInt(updateProperties['needPlayers']);
            if (updateProperties['maxPlayers'] !== undefined)
                updateProperties['maxPlayers'] = parseInt(updateProperties['maxPlayers']);

            if ((updateProperties['note'] !== undefined) && (updateProperties['note'] === ''))
                updateProperties['note'] = '/';

            return updateProperties;
        },
        openTimePicker: function () {
            UIComponents.pickers.timePicker.open();
        },
        openDayPicker: function () {
            UIComponents.pickers.dayPicker.open();
        },
        openEndDatePicker: function () {
            UIComponents.pickers.endDatePicker.open();
        }
    }
});