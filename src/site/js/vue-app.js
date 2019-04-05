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

            // remove the spinner after all pictures are loaded
            var spinner = document.querySelector('#spinner');
            spinner.style.display = "none";
            
            var body = document.querySelector('body');
            body.classList.remove("spinner-loading");
        })
    },
    watch: {
        
    },
    computed: {
        
    },
    methods: {

    }
});