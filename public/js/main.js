$(window).scroll(function() {
    if ($(document).scrollTop() > 50) {
        $('nav').addClass('shrink');
    }
    else {
        $('nav').removeClass('shrink');
    }
});

$(document).ready(function(){
  $(".owl-carousel").owlCarousel({
  items: 1,
  loop: true,
  autoplay:true,
  smartSpeed: 300
  });
});
const menu = document.getElementById("responsiveMenu");
const searchBar = document.getElementById("navSearch");
const searchBar2 = document.getElementById("navSearch");

searchBar.style.display = "none";

menu.addEventListener("click",(e) => {
    console.log(searchBar.getAttribute("style"));
    
    if(searchBar.style.display == "none") 
    {
        searchBar.style.display = "block";
    }
    else if(searchBar.style.display == "block")
    {
        searchBar.style.display = "none";
    }
});

