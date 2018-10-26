function renderFile(file) {
  document.getElementById("title").innerText = file.title;
  document.getElementById("edition").innerText = file.edition;
  var objects = file.objects;
  var content = document.getElementById("content");
  for ( var i = 0; i < objects.length; i++ ) {
    if ( objects[i].type == "paragraph" ) {
      var text = objects[i].text;
      var p = document.createElement("p");
      while ( text.indexOf("[b]") > -1 ) {
        var span = document.createElement("span");
        span.innerText = text.slice(0,text.indexOf("[b]"));
        p.appendChild(span);
        text = text.slice(text.indexOf("[b]") + 3);
        var b = document.createElement("b");
        b.innerText = text.slice(0,text.indexOf("[/b]"));
        p.appendChild(b);
        text = text.slice(text.indexOf("[/b]") + 4);
      }
      var span = document.createElement("span");
      span.innerText = text;
      p.appendChild(span);
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
  req.open("GET",`/article_data?file=${sessionStorage.getItem("file")}&index=${sessionStorage.getItem("index")}`);
  req.send();
}

window.onload = function() {
  queryFile(renderFile);
  // Theme code that will be removed at some point
  if ( ! isNaN(parseInt(location.search.slice(1))) ) localStorage.setItem("theme",parseInt(location.search.slice(1)));
  document.body.style.setProperty("--bg-color",["white","#4abdac","#f2eee2"][localStorage.getItem("theme") || 0]);
  document.body.style.setProperty("--fg-color",["black","white","black"][localStorage.getItem("theme") || 0]);
  document.body.style.setProperty("--link-color",["blue","#4aec1a","#ff3b3f"][localStorage.getItem("theme") || 0]);
}
