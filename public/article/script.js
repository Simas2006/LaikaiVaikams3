var replaceAll = (s,o,n) => s.split(o).join(n);

function renderFile(file) {
  document.getElementById("title").innerText = file.title;
  document.getElementById("edition").innerText = file.edition;
  var objects = file.objects;
  var content = document.getElementById("content");
  for ( var i = 0; i < objects.length; i++ ) {
    if ( objects[i].type == "paragraph" ) {
      var text = objects[i].text;
      for ( var j = 0; j < file.glossary.length; j++ ) {
        text = replaceAll(text,`${file.glossary[j][0]}`,`<a href="#glossary" class="glossaryLink">${file.glossary[j][0]}</a>`);
      }
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
      var caption = document.createElement("b");
      caption.innerText = objects[i].caption;
      p.appendChild(caption);
      content.appendChild(p);
    } else if ( objects[i].type == "hline" ) {
      content.appendChild(document.createElement("hr"));
    }
  }
  renderGlossary(file);
}

function renderGlossary(file) {
  var div = document.getElementById("glossary");
  for ( var i = 0; i < file.glossary.length; i++ ) {
    var p = document.createElement("p");
    var bold = document.createElement("b");
    bold.innerText = file.glossary[i][0];
    p.appendChild(bold);
    var span = document.createElement("span");
    span.innerText = `: ${file.glossary[i][1]}; `;
    p.appendChild(span);
    var italic = document.createElement("i");
    italic.innerText = file.glossary[i][2];
    p.appendChild(italic);
    div.appendChild(p);
  }
}

function renderComments() {
  var req = new XMLHttpRequest();
  req.onload = function() {
    if ( this.responseText == "Bad Request" ) return;
    var comments = JSON.parse(this.responseText);
    if ( ! comments ) return;
    var commentDiv = document.getElementById("comments");
    while ( commentDiv.lastChild.className == "comment" ) {
      commentDiv.removeChild(commentDiv.lastChild);
    }
    for ( var i = 0; i < comments.length; i++ ) {
      var div = document.createElement("div");
      div.className = "comment";
      var name = document.createElement("b");
      name.innerText = `${comments[i].name} sako:`;
      div.appendChild(name);
      var content = document.createElement("p");
      content.className = "comment-content";
      content.innerText = comments[i].content;
      div.appendChild(content);
      commentDiv.appendChild(div);
    }
  }
  req.open("GET",`/server_access/get_comments.php?file=${sessionStorage.getItem("file")}&index=${sessionStorage.getItem("index")}`);
  req.send();
}

function commentCharTrigger() {
  var length = document.getElementById("comment-box").value.length;
  document.getElementById("comment-limit").innerText = `${250 - length} raidziu liko`;
  document.getElementById("comment-limit").style.color = 250 - length < 0 ? "red" : "black";
}

function postComment() {
  var content = document.getElementById("comment-box").value;
  var name = document.getElementById("comment-name").value;
  if ( content.length > 250 ) {
    alert("Komentaras negali but ilgesnis nei 250 raidziu!");
    return;
  }
  if ( name.length > 50 ) {
    alert("Vardas negali but ilgesnis nei 50 raidziu!");
    return;
  }
  if ( ! content ) {
    alert("Reikia parasyt komentara!");
    return;
  }
  if ( ! name ) {
    alert("Reikia parasyt varda!");
    return;
  }
  var req = new XMLHttpRequest();
  req.onload = function() {
    if ( this.responseText == "Bad Request" ) {
      alert("Failed to post the comment. Please try again.");
      return;
    }
    document.getElementById("comment-box").value = "";
    document.getElementById("comment-name").value = "";
    renderComments();
  }
  req.open("POST",`/server_access/send_comment.php?file=${sessionStorage.getItem("file")}&index=${sessionStorage.getItem("index")}&name=${name}`);
  req.send(content);
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
  renderComments();
}
