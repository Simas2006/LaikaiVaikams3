function renderVersions(list) {
  var obj = document.getElementById("tab");
  var activeUL,activeYear;
  for ( var i = 0; i < list.length + 1; i++ ) {
    if ( ! list[i] || activeYear != list[i].file.split("_")[0] ) {
      if ( activeUL ) {
        var nestedLi = document.createElement("li");
        var span = document.createElement("span");
        span.innerText = activeYear + " ";
        nestedLi.appendChild(span);
        nestedLi.appendChild(activeUL);
        obj.appendChild(nestedLi);
      }
      activeUL = document.createElement("ul");
      if ( list[i] ) activeYear = list[i].file.split("_")[0];
    }
    if ( ! list[i] ) break;
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.innerText = list[i].edition;
    a["data-id"] = i;
    a.onclick = function() {
      sessionStorage.setItem("file",list[this["data-id"]].file);
      location.href = "/public/home";
    }
    li.appendChild(a);
    activeUL.appendChild(li);
  }
  var li = document.createElement("li");
  var a = document.createElement("a");
  a.innerText = "I naujausia versija";
  a.onclick = function() {
    sessionStorage.setItem("file",list[list.length - 1].file);
    location.href = "/public/home";
  }
  li.appendChild(a);
  obj.appendChild(li);
}

function queryVersions(callback) {
  var req = new XMLHttpRequest();
  req.onload = function() {
    if ( this.responseText == "Bad Request" ) {
      alert("Failed to load the page. Please try again.");
      return;
    }
    callback(JSON.parse(this.responseText));
  }
  req.open("GET","/list_data");
  req.send();
}
