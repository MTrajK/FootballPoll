var app = new Vue({
    el: '#app',
    data: {
        showMainSpinner: true,
        showPollInfo: true,
        savingPollInfo: false,
        updatingPollParticipants: false,
        loadingOldPolls: false,
        loadingOldPollInfo: false,
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
            thisApp.showMainSpinner = false;

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
            UIComponents.showOldPollModal.showOldPollModalInstance = M.Modal.init(thisApp.$el.querySelector('#show-old-poll-modal'));
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
            this.savingPollInfo = true;
            UIComponents.saveInfoModal.saveInfoModalInstance.options.dismissible = false;

            var thisApp = this;
            setTimeout(function(){
                thisApp.showPollInfo = true;
                UIComponents.saveInfoModal.saveInfoModalInstance.close(); 
                thisApp.savingPollInfo = false;
                UIComponents.saveInfoModal.saveInfoModalInstance.options.dismissible = true;
                M.toast({html: 'The poll info is successfully updated!'});
            }, 5000);
        },
        addPollParticipant: function () {
            this.updatingPollParticipants = true;

            var thisApp = this;
            setTimeout(function(){ 
                thisApp.updatingPollParticipants = false;
                M.toast({html: 'The participant is successfully added!'});
            }, 5000);
        },
        deletePollParticipant: function () {
            this.updatingPollParticipants = true;

            var thisApp = this;
            setTimeout(function(){ 
                thisApp.updatingPollParticipants = false;
                M.toast({html: 'The participant is successfully deleted!'});
            }, 5000);
        },
        loadOldPolls: function () {
            this.loadingOldPolls = true;

            var thisApp = this;
            setTimeout(function(){ 
                thisApp.loadingOldPolls = false; 
            }, 5000);
        },
        loadOldPollInfo: function () {
            this.loadingOldPollInfo = true;
            UIComponents.showOldPollModal.showOldPollModalInstance.options.dismissible = false;

            var thisApp = this;
            setTimeout(function(){ 
                thisApp.loadingOldPollInfo = false; 
                UIComponents.showOldPollModal.showOldPollModalInstance.options.dismissible = true;
            }, 5000);
        },


        /******************************
        **       HELP METHODS        **
        ******************************/

        editPollInfo: function () {
            this.showPollInfo = false;
        },
        cancelEditingPollInfo: function () {
            this.showPollInfo = true;
        },
    }
});