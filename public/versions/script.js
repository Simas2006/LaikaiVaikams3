function renderList(list) {
  var obj = document.getElementById("versions");
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
    li.innerText = list[i].edition;
    activeUL.appendChild(li);
  }
}

function queryList(callback) {
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

window.onload = function() {
  queryList(renderList);
}
