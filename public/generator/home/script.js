var articles;

function renderMenu() {
  var menu = document.getElementById("menu");
  for ( var i = 0; i < articles.length; i++ ) {
    var row = document.createElement("tr");
    var col1 = document.createElement("td");
    var a = document.createElement("a");
    a.innerText = articles[i].title || "Nepavadintas";
    a["data-index"] = i;
    a.onclick = function() {
      sessionStorage.setItem("index",this["data-index"]);
      location.href = "/generator/edit/index.html";
    }
    col1.appendChild(a);
    row.appendChild(col1);
    var col2 = document.createElement("td");
    var span = document.createElement("span");
    span.innerText = [
      "Rasymas vyksta",
      "Parasytas, reike perziuret",
      "Perziuretas, reike patvirtinimo",
      "Paruostas eit i produkcija"
    ][articles[i].state];
    span.className = "state";
    col2.appendChild(span);
    if ( articles[i].state < 3 ) {
      var button = document.createElement("button");
      button.innerText = [
        "Parasytas",
        "Perziuretas",
        "Patvirtintas"
      ][articles[i].state];
      button["data-index"] = i;
      button.onclick = function() {
        articles[parseInt(this["data-index"])].state++;
        var req = new XMLHttpRequest();
        req.onload = function() {
          if ( this.responseText == "Bad Request" ) {
            alert("Failed to change the article state. Please try again.");
            return;
          } else {
            location.reload();
          }
        }
        req.open("GET",`/generator/server_access/get_dev_articles.php?index=${this["data-index"]}`);
        req.send();
      }
      col2.appendChild(button);
    }
    row.appendChild(col2);
    var col3 = document.createElement("td");
    if ( articles[i].thumbnail ) {
      var img = document.createElement("img");
      img.src = articles[i].thumbnail;
      img.className = "thumbnail";
      col3.appendChild(img);
    } else {
      var div = document.createElement("div");
      div.innerText = "Nera Paveikslo";
      div.className = "noimage";
      col3.appendChild(div);
    }
    row.appendChild(col3);
    menu.appendChild(row);
  }
}

window.onload = function() {
  var req = new XMLHttpRequest();
  req.onload = function() {
    if ( this.responseText == "Bad Request" ) {
      alert("Failed to load the article. Please try again.");
      return;
    } else {
      articles = JSON.parse(this.responseText);
      renderMenu();
    }
  }
  req.open("GET","/generator/server_access/get_dev_articles.php");
  req.send();
}
