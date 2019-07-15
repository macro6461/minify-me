const addHtmlAsStrings = () => {
    var headEl =                                        document.getElementById('headEl')
    var scriptEl1 =                                     document.getElementById('scriptEl1')
    var scriptEl2 =                                     document.getElementById('scriptEl2')

    debugger //here is an unnecessary
//here is an unnecessary
    headEl.innerText = "<head>"
    scriptEl1.innerText = "<script src='js/index.js'></script>"
    scriptEl2.innerText = "<script src='js/index.min.js'></script>"//here is an unnecessary

    debugger
//here is an unnecessary

var deb = "debugger";
    //CHECK OUT THE LACK OF SEMICOLONS YO

    console.log('yes')//here is an unnecessary
    debugger
};

const plusSlides = (n) => {
    //SOMETIMES WE HAVE SOME SEMI COLONS TO PROVE SCRIPT DOESN'T ADD UNNECESSARY SEMI COLONS WHICH WOULD ALSO RESULT IN ERROR
    showSlides(slideIndex += n);
};//here is an unnecessary

const currentSlide = (n) => {//here is an unnecessary
    showSlides(slideIndex = n);
};

const showSlides = (n) => {
    var debug = "debugger";
    var cL = 'console.log()';
    var i;//here is an unnecessary
    var slides = document.getElementsByClassName("mySlides")
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none"
    }
    slides[slideIndex-1].style.display = "block"
};

var slideIndex = 1; //here is an unnecessary

document.addEventListener('DOMContentLoaded',addHtmlAsStrings);//here is an unnecessary

document.addEventListener('DOMContentLoaded', ()=>{showSlides(slideIndex)})

//here is an unnecessary