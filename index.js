const addHtmlAsStrings = () => {
    var headEl =                                        document.getElementById('headEl');
    var scriptEl1 =                                     document.getElementById('scriptEl1');
    var scriptEl2 =                                     document.getElementById('scriptEl2');

    debugger

    headEl.innerText = "<head>";
    scriptEl1.innerText = "<script src='js/index.js'></script>";
    scriptEl2.innerText = "<script src='js/index.min.js'></script>";

    debugger


console.log('yes');
debugger
};

const plusSlides = (n) => {
    showSlides(slideIndex += n);
};
  
const currentSlide = (n) => {
   showSlides(slideIndex = n);
};

const showSlides = (n) => {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) {slideIndex = 1} 
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none"; 
    }
    slides[slideIndex-1].style.display = "block"; 
};

var slideIndex = 1;

document.addEventListener('DOMContentLoaded',addHtmlAsStrings);

document.addEventListener('DOMContentLoaded', ()=>{showSlides(slideIndex)});
