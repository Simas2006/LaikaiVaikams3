var replaceAll = (s,o,n) => s.split(o).join(n);

function renderFile(file) {
  document.getElementById("title").innerText = file.title;
  document.getElementById("edition").innerText = file.edition;
  var objects = file.objects;
  var content = document.getElementById("content");
  var imageBox;
  for ( var i = 0; i < objects.length; i++ ) {
    if ( objects[i].type == "paragraph" ) {
      var text = replaceAll(objects[i].text,"\n","<br />");
      for ( var j = 0; j < file.glossary.length; j++ ) {
        var firstLetter = file.glossary[j][0].charAt(0);
        var restOfWord = file.glossary[j][0].slice(1);
        text = replaceAll(text,`${firstLetter.toLowerCase() + restOfWord}`,`<a href="#glossary" class="glossaryLink">${firstLetter.toLowerCase() + restOfWord}</a>`);
        text = replaceAll(text,`${firstLetter.toUpperCase() + restOfWord}`,`<a href="#glossary" class="glossaryLink">${firstLetter.toUpperCase() + restOfWord}</a>`);
      }
      var p = document.createElement("p");
      p.innerHTML = text;
      p.className = "paragraph";
      (imageBox || content).appendChild(p);
      imageBox = null;
    } else if ( objects[i].type == "image" ) {
      var table = document.createElement("table");
      table.className = "imageTable";
      var row = document.createElement("tr");
      row.className = "imageRow";
      var col = document.createElement("td");
      col.className = "imageCol";
      var img = document.createElement("img");
      img.src = objects[i].src;
      img.style.width = (objects[i].size * .365 || 36.5) + "vw";
      col.appendChild(img);
      col.appendChild(document.createElement("br"));
      var caption = document.createElement("b");
      caption.innerText = objects[i].caption;
      col.appendChild(caption);
      row.appendChild(col);
      table.appendChild(row);
      content.appendChild(table);
      var paragraphCol = document.createElement("td");
      paragraphCol.className = "imageCol";
      row.appendChild(paragraphCol);
      imageBox = paragraphCol;
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
  document.getElementById("comment-limit").innerText = `${250 - length} raidžių liko`;
  document.getElementById("comment-limit").style.color = 250 - length < 0 ? "red" : "black";
}

function postComment() {
  var content = document.getElementById("comment-box").value;
  var name = document.getElementById("comment-name").value;
  if ( content.length > 250 ) {
    alert("Komentaras negali but ilgesnis nei 250 raidžių!");
    return;
  }
  if ( name.length > 50 ) {
    alert("Vardas negali but ilgesnis nei 50 raidžių!");
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
    if ( sessionStorage.getItem("file") == "dev_version" ) {
      document.getElementById("returnLink").href = "/generator/edit/index.html";
      document.getElementById("edition").innerText = "Dar ne produkcijoj";
      document.getElementById("comments").style.display = "none";
      sessionStorage.setItem("reloadfromsave",1);
    }
  }
  req.open("GET",`/server_access/article_data.php?file=${sessionStorage.getItem("file")}&index=${sessionStorage.getItem("index")}`);
  req.send();
}

window.onload = function() {
  queryFile(renderFile);
  renderComments();
}
