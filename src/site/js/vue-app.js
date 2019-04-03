document.addEventListener('DOMContentLoaded', function () {
    var scrollspy = document.querySelectorAll('.scrollspy');
    M.ScrollSpy.init(scrollspy);
});

window.addEventListener("load", function (event) {
    // remove the spinner after all pictures are loaded
    var spinner = document.querySelector('#spinner');
    spinner.style.display = "none";
    
    var body = document.querySelector('body');
    body.classList.remove("spinner-loading");
});