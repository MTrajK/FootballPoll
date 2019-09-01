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
        },
        currentPoll: {
            info: {

            },
            editedInfo: {

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
        oldPolls: [
            /*
            {
                info: {

                },
                participants: [],
            }
            */
        ],
        oldPollIdx: undefined,
        /* Use something like this for old poll renderning
            <h6 v-if="UIBindings.showOldPollInfo">{{oldPolls[oldPollIdx].Title}}</h6>
        */
    },
    mounted: function () {
        /**
        * init ui components and create the data needed for the app
        */
        this.$nextTick(function () {
            var thisApp = this;

            /*
                TODO: MAKE THESE THINGS AS UI COMPONENTS
            */
            var scrollspy = document.querySelectorAll('.scrollspy');
            M.ScrollSpy.init(scrollspy);

            // remove the main spinner after all of the content is loaded
            // DON'T USE VUE FOR THE MAIN SPINNER!
            var mainSpinner = document.querySelector('#main-spinner');
            mainSpinner.parentNode.removeChild(mainSpinner);

            var body = document.querySelector('body');
            body.classList.remove("spinner-loading");

            var timeElems = document.querySelectorAll('.timepicker');
            var timeInstances = M.Timepicker.init(timeElems, {
                'twelveHour': false
            });

            var dateElems = document.querySelectorAll('.datepicker');
            var dateInstances = M.Datepicker.init(dateElems, {
                'format': 'dddd (dd.mm.yyyy)'
            });

            var autocompleteElems = document.querySelectorAll('.autocomplete');
            var autocompleteInstances = M.Autocomplete.init(autocompleteElems, {
                data: {
                    'abcd': null,
                    'meto': null,
                    'hehehe': null,
                    'uaaa': null,
                    'asdasd': null
                }
            });

            UIComponents.saveInfoModal.saveInfoModalInstance = M.Modal.init(thisApp.$el.querySelector('#save-info-modal'));
            UIComponents.showStatsModal.showStatsModalInstance = M.Modal.init(thisApp.$el.querySelector('#show-stats-modal'));
            UIComponents.showOldPollModal.showOldPollModalInstance = M.Modal.init(thisApp.$el.querySelector('#show-old-poll-modal'), {
                onCloseEnd: function () {
                    thisApp.UIBindings.showOldPollInfo = false;
                }
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
            UIComponents.saveInfoModal.saveInfoModalInstance.options.dismissible = false;

            var thisApp = this;
            setTimeout(function(){
                thisApp.UIBindings.showPollInfo = true;
                UIComponents.saveInfoModal.saveInfoModalInstance.close(); 
                thisApp.UIBindings.savingPollInfo = false;
                UIComponents.saveInfoModal.saveInfoModalInstance.options.dismissible = true;
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
            UIComponents.showOldPollModal.showOldPollModalInstance.options.dismissible = false;

            var thisApp = this;
            setTimeout(function(){ 
                thisApp.UIBindings.showOldPollInfo = true;
                thisApp.UIBindings.loadingOldPollInfo = false;
                UIComponents.showOldPollModal.showOldPollModalInstance.options.dismissible = true;
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
    }
});