function renderFile(file) {
  document.getElementById("title").innerText = file.title;
  document.getElementById("edition").innerText = file.edition;
  var objects = file.objects;
  var content = document.getElementById("content");
  for ( var i = 0; i < objects.length; i++ ) {
    if ( objects[i].type == "paragraph" ) {
      var text = objects[i].text;
      var p = document.createElement("p");
      p.innerHTML = text;
      content.appendChild(p);
    } else if ( objects[i].type == "image" ) {
      var p = document.createElement("p");
      p.className = "image";
      var img = document.createElement("img");
      img.src = objects[i].src;
      p.appendChild(img);
      p.appendChild(document.createElement("br"));
      var caption = document.createElement("i");
      caption.innerText = objects[i].caption;
      p.appendChild(caption);
      content.appendChild(p);
    } else if ( objects[i].type == "hline" ) {
      content.appendChild(document.createElement("hr"));
    }
  }
}

function queryFile(callback) {
  var req = new XMLHttpRequest();
  req.onload = function() {
    if ( this.responseText == "Bad Request" ) {
      alert("Failed to load the article. Please try again.");
      return;
    }
    callback(JSON.parse(this.responseText));
  }
  req.open("GET",`/server_access/article_data.php?file=${sessionStorage.getItem("file")}&index=${sessionStorage.getItem("index")}`);
  req.send();
}

window.onload = function() {
  queryFile(renderFile);
}
