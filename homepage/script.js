// var element = document.getElementsByClassName('about-btn')
// element.onclick = scrollinto(element)

document.getElementsByClassName('about-btn')[0].onclick = function() {scrollintofunction('about-text')};
document.getElementsByClassName('projects-btn')[0].onclick = function() {scrollintofunction('projects')};
document.getElementsByClassName('contact-btn')[0].onclick = function() {scrollintofunction('contact')};

var topbtn = document.getElementsByClassName('gotop')[0]
topbtn.onclick = function() {gototopfunction()};
window.onscroll = function() {scrollFunction(topbtn)};

function scrollintofunction(classname) {
    // var element = document.getElementsByClassName('contact-details');
    var element = document.getElementsByClassName(classname)[0];
    element.scrollIntoView();
    console.log("success");
}
function gototopfunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function scrollFunction(topbtn) {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      topbtn.style.display = "block";
    } else {
      topbtn.style.display = "none";
    }
  }