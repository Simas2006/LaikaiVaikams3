function renderMenu(edition) {
  var articles = edition.articles;
  var menu = document.getElementById("menu");
  var row = document.createElement("tr");
  var odds = true;
  for ( var i = 0; i < articles.length; i++ ) {
    var col = document.createElement("td");
    col.onclick = function() {
      localStorage.setItem("index",this["data-id"]);
      location.href = "/public/article";
    }
    col["data-id"] = i;
    col.className = "link";
    var img = document.createElement("img");
    img.src = articles[i].thumbnail;
    col.appendChild(img);
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
}

function queryMenu(callback) {
  var req = new XMLHttpRequest();
  req.onload = function() {
    if ( this.responseText == "Bad Request" ) {
      alert("Failed to load the page. Please try again.");
      return;
    }
    callback(JSON.parse(this.responseText));
  }
  req.open("GET",`/edition_data?file=${localStorage.getItem("file")}`);
  req.send();
}

window.onload = function() {
  queryMenu(renderMenu);
}
