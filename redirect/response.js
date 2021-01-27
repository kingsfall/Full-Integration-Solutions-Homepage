var homebtn = document.getElementsByClassName('gotohomepage')[0];
homebtn.onclick = function() {returnhome()};

function returnhome() {
    location.replace('http://localhost:3000');
}

setTimeout("location.href = 'http://localhost:3000';",4000);