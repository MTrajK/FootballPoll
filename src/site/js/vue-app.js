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
            playerName: '',
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
            /* Use something like this for old poll renderning
                <h6 v-if="UIBindings.showOldPollInfo">{{oldPolls.polls[oldPolls.oldPollIdx].Title}}</h6>
            */
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
            UIComponents.nameAutocomplete = M.Autocomplete.init(document.querySelector('#name-autocomplete'));

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

                thisApp.allNames = {

                };

                
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
        currentPollShowNote: function () {
            var note = this.currentPoll.info.note;
            
            return (note != undefined) && (note != '');
        },
        currentPollTime: function () {
            return this.formatTime(this.currentPoll.info.dayTime);
        }, 
        currentPollDayDate: function () {
            return this.formatDayDate(this.currentPoll.info.dayTime);
        },
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
        loadOldPollInfo: function () {
            this.UIBindings.loadingOldPollInfo = true;
            UIComponents.modals.showOldPollModal.options.dismissible = false;

            var thisApp = this;
            setTimeout(function(){ 
                thisApp.UIBindings.showOldPollInfo = true;
                thisApp.UIBindings.loadingOldPollInfo = false;
                UIComponents.modals.showOldPollModal.options.dismissible = true;
            }, 5000);
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
            var hours = date.getHours();
            var minutes = date.getMinutes();

            return `${hours}:${minutes}`;
        },
        formatDayDate: function (milliseconds) {
            var date = new Date(milliseconds);
            var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
            var formattedDate = this.formatDate(milliseconds);

            return `${weekday} (${formattedDate})`;
        },
    }
});