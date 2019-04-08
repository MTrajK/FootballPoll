new Vue({
    el: '#app',
    data: {
        
    },
    mounted: function () {
        /**
        * init materialize components and create the data needed for the app
        */
        this.$nextTick(function () {
            var thisApp = this;
            
            /*
                TODO: MAKE THESE THINGS AS MATERIALIZE COMPONENTS
            */
            var scrollspy = document.querySelectorAll('.scrollspy');
            M.ScrollSpy.init(scrollspy);

            // remove the main spinner after all of the content is loaded
            var mainSpinner = document.querySelector('#main-spinner');
            mainSpinner.style.display = "none";
            
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
        })
    },
    watch: {
        
    },
    computed: {
        
    },
    methods: {

    }
});