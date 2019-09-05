var app = new Vue({
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
                time: undefined,
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
            polls: [ /* { info: {}, participants: [] } */ ],
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
            UIComponents.labels.editInfoNote = document.querySelector('#note-input-label');

            // Get site data
            API.getSiteData(function (results) {
                // update data
                thisApp.currentPoll = results.currentPoll;
                thisApp.allNames = results.allNames;
                thisApp.participantsStats = results.participantsStats;
                thisApp.oldPolls = results.oldPolls;

                // update autocomplete
                thisApp.updateAutocomplete();

                // update pickers
                thisApp.updatePickers();

                // Remove the main spinner after all of the content is loaded
                // DON'T USE VUE FOR THE MAIN SPINNER!
                var mainSpinner = document.querySelector('#main-spinner');
                mainSpinner.parentNode.removeChild(mainSpinner);
                document.querySelector('body').classList.remove('spinner-loading');

                // focus on adding player input
                UIComponents.labels.addParticipantName.focus();
            });

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
        addButtonDisabled: function () {
            var personName = this.addPollParticipantForm.personName;
            var friendName = this.addPollParticipantForm.friendName;

            if ((personName === undefined) || (friendName === undefined) || (personName === ''))
                return true;

            if (friendName !== '')
                return false;

            personName = personName.toLowerCase();
            if (this.allNames.newNames[personName] === undefined)
                return false
                
            return true;
        }
    },
    methods: {

        /******************************
        **         API CALLS         **
        ******************************/

        savePollInfo: function () {
            this.UIBindings.savingPollInfo = true;
            UIComponents.modals.saveInfoModal.options.dismissible = false;

            var thisApp = this;
            setTimeout(function () {
                thisApp.UIBindings.showPollInfo = true;
                UIComponents.modals.saveInfoModal.close();
                thisApp.UIBindings.savingPollInfo = false;
                UIComponents.modals.saveInfoModal.options.dismissible = true;
                M.toast({ html: 'The poll info is successfully updated!' });
            }, 5000);
        },
        addPollParticipant: function () {
            this.UIBindings.updatingPollParticipants = true;

            var thisApp = this;
            setTimeout(function () {
                thisApp.addPollParticipantForm.personName = '';
                thisApp.addPollParticipantForm.friendName = '';
                UIComponents.labels.addParticipantName.classList.remove('active');
                UIComponents.labels.addParticipantFriend.classList.remove('active');
                thisApp.UIBindings.updatingPollParticipants = false;
                M.toast({ html: 'The participant is successfully added!' });
            }, 5000);
        },
        deletePollParticipant: function () {
            this.UIBindings.updatingPollParticipants = true;

            var thisApp = this;
            setTimeout(function () {
                thisApp.UIBindings.updatingPollParticipants = false;
                M.toast({ html: 'The participant is successfully deleted!' });
            }, 5000);
        },
        loadOldPolls: function () {
            this.UIBindings.loadingOldPolls = true;

            var thisApp = this;
            setTimeout(function () {
                thisApp.UIBindings.loadingOldPolls = false;
            }, 5000);
        },
        loadOldPollInfo: function (selectedPollIdx) {
            this.UIBindings.loadingOldPollInfo = true;
            UIComponents.modals.showOldPollModal.options.dismissible = false;

            this.oldPolls.selectedPollIdx = selectedPollIdx;

            if (this.oldPolls.polls[selectedPollIdx].participants === undefined) {
                var thisApp = this;
                API.getPollParticipants(this.oldPolls.polls[selectedPollIdx].info.pollId, function (participants) {
                    thisApp.oldPolls.polls[selectedPollIdx].participants = participants;
                    thisApp.loadedOldPollInfo();
                });
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

            UIComponents.labels.editInfoNote.classList.remove('active');
            this.updatePickers();
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
            if ((need === undefined) || (max === undefined) || (total > max))
                return {};

            var red = [229, 57, 53]; // #e53935
            var green = [124, 179, 66]; // #7cb342

            var percentage = total / need;
            if (total > need)
                percentage = 1 - (total - need) / (max - need) * 0.5;

            var newColor = '#';
            for (var i = 0; i < 3; i++)
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

            this.currentPoll.editInfo.time = this.formatTime(this.currentPoll.info.dayTime);
            UIComponents.pickers.timePicker._updateTimeFromInput();
        },
        updateAutocomplete: function () {
            var oldNames = {};
            var newNames = {};
            Object.keys(this.allNames.oldNames).forEach((a) => (oldNames[this.capitalizeFirstLetters(a)] = null));
            Object.keys(this.allNames.newNames).forEach((a) => (newNames[this.capitalizeFirstLetters(a)] = null));
            var mergedNames = { ...oldNames, ...newNames };
            UIComponents.nameAutocomplete.updateData(mergedNames);
        },
    }
});