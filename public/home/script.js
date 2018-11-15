function renderMenu(edition) {
  var articles = edition.articles;
  var menu = document.getElementById("menu");
  var row = document.createElement("tr");
  var odds = false;
  for ( var i = 0; i < articles.length; i++ ) {
    var col = document.createElement("td");
    col.onclick = function() {
      sessionStorage.setItem("index",this["data-id"]);
      location.href = "/public/article";
    }
    col["data-id"] = i;
    col.className = "link";
    var img = document.createElement("img");
    img.src = articles[i].thumbnail;
    col.appendChild(img);
    col.appendChild(document.createElement("br"));
    var span = document.createElement("span");
    span.innerText = articles[i].title;
    col.appendChild(span);
    row.appendChild(col);
    if ( odds ) {
      menu.appendChild(row);
      row = document.createElement("tr");
    }
    odds = ! odds;
  }
  menu.appendChild(row);
  document.getElementById("edition").innerText = edition.edition;
  if ( edition.timestamp + 1000 * 60 * 60 * 24 * 10 > new Date().getTime() ) document.getElementById("new-version").innerText = "NAUJA VERSIJA";
}

function queryMenu(callback) {
  var req = new XMLHttpRequest();
  req.onload = function() {
    if ( this.responseText == "Bad Request" ) {
      alert("Failed to load the page. Please try again.");
      return;
    }
    var data = JSON.parse(this.responseText);
    if ( data.setFile ) sessionStorage.setItem("file",data.setFile);
    callback(data);
  }
  req.open("GET",`/edition_data?file=${sessionStorage.getItem("file")}`);
  req.send();
}

window.onload = function() {
  if ( ! sessionStorage.getItem("file") ) sessionStorage.setItem("file","latest");
  queryMenu(renderMenu);
}
