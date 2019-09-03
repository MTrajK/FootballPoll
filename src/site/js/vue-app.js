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
            editedInfo: {
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
            polls: [
                /*
                {
                    info: {

                    },
                    participants: [],
                }
                */
            ],
        },
    },
    mounted: function () {
        /**
        * init ui components and get the data needed for the app
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
            });
            UIComponents.pickers.dayPicker = M.Datepicker.init(
                document.querySelector('#day-input'), {
                'format': 'dddd (dd.mm.yyyy)',
                'autoClose': true
            });
            UIComponents.pickers.endDatePicker = M.Datepicker.init(
                document.querySelector('#end-date-input'), {
                'format': 'dddd (dd.mm.yyyy)',
                'autoClose': true
            });

            // Init modals
            UIComponents.modals.saveInfoModal = M.Modal.init(document.querySelector('#save-info-modal'));
            UIComponents.modals.showStatsModal = M.Modal.init(document.querySelector('#show-stats-modal'));
            UIComponents.modals.showOldPollModal = M.Modal.init(document.querySelector('#show-old-poll-modal'), {
                onCloseEnd: function () {
                    thisApp.UIBindings.showOldPollInfo = false;
                }
            });

            // Get site data
            API.getSiteData(function (results) {
                thisApp.currentPoll = results.currentPoll;
                thisApp.allNames = results.allNames;
                thisApp.participantsStats = results.participantsStats;
                thisApp.oldPolls = results.oldPolls;

                // update autocomplete
                var mergedNames = {...thisApp.allNames.oldNames, ...thisApp.allNames.newNames};
                UIComponents.nameAutocomplete.updateData(mergedNames);
                
                // update pickers
                UIComponents.pickers.dayPicker.setDate(new Date(thisApp.currentPoll.info.dayTime));
                UIComponents.pickers.dayPicker._finishSelection();

                UIComponents.pickers.endDatePicker.setDate(new Date(thisApp.currentPoll.info.endDate));
                UIComponents.pickers.endDatePicker._finishSelection();

                thisApp.currentPoll.editedInfo.time = thisApp.formatTime(thisApp.currentPoll.info.dayTime);
                UIComponents.pickers.timePicker._updateTimeFromInput();

                // Remove the main spinner after all of the content is loaded
                // DON'T USE VUE FOR THE MAIN SPINNER!
                var mainSpinner = document.querySelector('#main-spinner');
                mainSpinner.parentNode.removeChild(mainSpinner);
                document.querySelector('body').classList.remove('spinner-loading');
            });

        })
    },
    watch: {
        
    },
    computed: {

    },
    methods: {

        /******************************
        **         API CALLS         **
        ******************************/

        savePollInfo: function () {
            this.UIBindings.savingPollInfo = true;
            UIComponents.modals.saveInfoModal.options.dismissible = false;

            var thisApp = this;
            setTimeout(function(){
                thisApp.UIBindings.showPollInfo = true;
                UIComponents.modals.saveInfoModal.close(); 
                thisApp.UIBindings.savingPollInfo = false;
                UIComponents.modals.saveInfoModal.options.dismissible = true;
                M.toast({html: 'The poll info is successfully updated!'});
            }, 5000);
        },
        addPollParticipant: function () {
            this.UIBindings.updatingPollParticipants = true;

            var thisApp = this;
            setTimeout(function(){ 
                thisApp.UIBindings.updatingPollParticipants = false;
                M.toast({html: 'The participant is successfully added!'});
            }, 5000);
        },
        deletePollParticipant: function () {
            this.UIBindings.updatingPollParticipants = true;

            var thisApp = this;
            setTimeout(function(){ 
                thisApp.UIBindings.updatingPollParticipants = false;
                M.toast({html: 'The participant is successfully deleted!'});
            }, 5000);
        },
        loadOldPolls: function () {
            this.UIBindings.loadingOldPolls = true;

            var thisApp = this;
            setTimeout(function(){ 
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

            for (var i=0; i<splitted.length; i++)
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
    }
});