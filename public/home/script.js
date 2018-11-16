function renderMenu(edition) {
  var articles = edition.articles;
  for ( var i = 1; i < articles.length; i++ ) {
    var obj = document.getElementById("article" + (i + 1));
    var div = document.createElement("div");
    div.className = "image";
    var img = document.createElement("img");
    img.src = articles[i].thumbnail;
    div.appendChild(img);
    obj.appendChild(div);
    var div = document.createElement("div");
    div.className = "text";
    var p = document.createElement("p");
    p.innerText = articles[i].title;
    div.appendChild(p);
    obj.appendChild(div);
    obj["data-index"] = i;
    obj.onclick = function() {
      sessionStorage.setItem("index",this["data-index"]);
      location.href = "/public/article/index.html";
    }
  }
  document.getElementById("edition").innerText = edition.edition;
  if ( edition.timestamp + 1000 * 60 * 60 * 24 * 10 > new Date().getTime() ) document.getElementById("new-version").innerText = "NAUJAS LEIDIMAS!";
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
