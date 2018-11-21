function renderMenu(edition) {
  var articles = edition.articles;
  var loadedValues = [];
  for ( var i = 0; i < articles.length; i++ ) {
    var obj = document.getElementById("article" + (i + 1));
    var div = document.createElement("div");
    div.className = "image";
    var img = document.createElement("img");
    img.src = articles[i].thumbnail;
    img["data-index"] = i;
    div.appendChild(img);
    obj.appendChild(div);
    var div = document.createElement("div");
    div.className = "text";
    var p = document.createElement("p");
    p.innerText = articles[i].title;
    p.className = "title-hidden";
    p.id = "article-text-" + i;
    div.appendChild(p);
    obj.appendChild(div);
    obj["data-index"] = i;
    obj.onclick = function() {
      sessionStorage.setItem("index",this["data-index"]);
      location.href = "/public/article/index.html";
    }
    img.onload = function() {
      var index = parseInt(this["data-index"]);
      var textObj = document.getElementById("article-text-" + index);
      loadedValues.push(this.width / textObj.offsetWidth);
      if ( loadedValues.length >= articles.length ) {
        var fontSize = Math.min.apply(null,loadedValues) * 100 + "%";
        for ( var j = 0; j < articles.length; j++ ) {
          document.getElementById("article-text-" + j).style.fontSize = fontSize;
          document.getElementById("article-text-" + j).className = "";
        }
      }
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
