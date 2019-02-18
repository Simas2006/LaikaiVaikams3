var file = {
  "title": "",
  "edition": "",
  "thumbnail": null,
  "objects": []
}

var replaceAll = (s,o,n) => s.split(o).join(n);

function renderScreen() {
  var content = document.getElementById("content");
  var objects = file.objects;
  while ( content.firstChild ) {
    content.removeChild(content.firstChild);
  }
  for ( var i = 0; i < objects.length; i++ ) {
    var labels = ["↑","↓","X"];
    if ( objects[i].type == "paragraph" ) {
      var div = document.createElement("div");
      var textarea = document.createElement("div");
      textarea["data-object-index"] = i;
      textarea.onkeydown = textarea.onkeyup = function() {
        objects[this["data-object-index"]].text = this.innerHTML;
      }
      textarea.innerHTML = objects[i].text;
      textarea.className = "paragraph";
      textarea.contentEditable = "true";
      textarea.onfocus = function() {
        var obj = objects[this["data-object-index"]];
        obj.focused = true;
        if ( obj.toggleBold ) {
          obj.boldSet = ! obj.boldSet;
          obj.toggleBold = false;
          setTimeout(function() {
            document.execCommand("bold");
          },10);
        }
      }
      textarea.onblur = function() {
        objects[this["data-object-index"]].focused = false;
      }
      div.appendChild(textarea);
      content.appendChild(div);
      labels.push("B");
    } else if ( objects[i].type == "image" ) {
      var p = document.createElement("p");
      p.className = "image";
      var img = document.createElement("img");
      img.src = objects[i].src;
      p.appendChild(img);
      p.appendChild(document.createElement("br"));
      var caption = document.createElement("input");
      caption["data-object-index"] = i;
      caption.className = "caption";
      caption.value = objects[i].caption;
      caption.placeholder = "Antraste..."
      caption.onkeydown = caption.onkeyup = function() {
        objects[this["data-object-index"]].caption = this.value;
      }
      p.appendChild(caption);
      content.appendChild(p);
    } else if ( objects[i].type == "hline" ) {
      var hr = document.createElement("hr");
      hr.className = "hline";
      content.appendChild(hr);
    }
    var panel = document.createElement("div");
    panel.className = "buttonPanel";
    var functions = [
      function() {
        var element = objects[this["data-object-index"]];
        objects.splice(this["data-object-index"],1);
        objects.splice(Math.max(this["data-object-index"] - 1,0),0,element);
        renderScreen();
      },
      function() {
        var element = objects[this["data-object-index"]];
        objects.splice(this["data-object-index"],1);
        objects.splice(Math.min(this["data-object-index"] + 1,objects.length),0,element);
        renderScreen();
      },
      function() {
        var element = objects[this["data-object-index"]];
        objects.splice(this["data-object-index"],1);
        renderScreen();
      },
      function() {
        var obj = objects[this["data-object-index"]];
        if ( obj.focused ) {
          document.execCommand("bold");
          obj.boldSet = ! obj.boldSet;
        } else {
          obj.toggleBold = ! obj.toggleBold;
        }
        this.style.fontWeight = (this.style.fontWeight == "bold" ? "normal" : "bold");
      }
    ];
    for ( var j = 0; j < labels.length; j++ ) {
      var button = document.createElement("button");
      button.innerText = labels[j];
      button["data-object-index"] = i;
      button.onclick = functions[j];
      panel.appendChild(button);
    }
    content.appendChild(panel);
  }
}

function addParagraph() {
  file.objects.push({
    "type": "paragraph",
    "text": "",
    "boldSet": false,
    "focused": false,
    "toggleBold": false
  });
  renderScreen();
}

function addImage() {
  var picker = document.getElementById("filePicker");
  picker.onchange = function() {
    var selectedImage = this.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
      file.objects.push({
        "type": "image",
        "src": reader.result,
        "caption": ""
      });
      renderScreen();
    }
    if ( selectedImage ) {
      if ( selectedImage.name.toLowerCase().endsWith(".jpg") || selectedImage.name.toLowerCase().endsWith(".png") || selectedImage.name.toLowerCase().endsWith(".tiff") ) reader.readAsDataURL(selectedImage);
      document.body.removeChild(picker);
      var newPicker = document.createElement("input");
      newPicker.type = "file";
      newPicker.id = "filePicker";
      document.body.appendChild(newPicker);
    }
  }
  picker.click();
}

function addHorizontal() {
  file.objects.push({
    "type": "hline"
  });
  renderScreen();
}

function setThumbnail() {
  if ( file.thumbnail ) {
    file.thumbnail = null;
    document.getElementById("thumbnailButton").innerText = "Nustatyt Paveiksla";
    return;
  }
  var picker = document.getElementById("filePicker");
  picker.onchange = function() {
    var selectedImage = this.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
      file.thumbnail = reader.result;
      document.getElementById("thumbnailButton").innerText = "Nustatyt Paveiksla ✓";
      renderScreen();
    }
    if ( selectedImage ) {
      if ( selectedImage.name.toLowerCase().endsWith(".jpg") || selectedImage.name.toLowerCase().endsWith(".png") || selectedImage.name.toLowerCase().endsWith(".tiff") ) reader.readAsDataURL(selectedImage);
      document.body.removeChild(picker);
      var newPicker = document.createElement("input");
      newPicker.type = "file";
      newPicker.id = "filePicker";
      document.body.appendChild(newPicker);
    }
  }
  picker.click();
}

function saveFile() {
  var objects = [];
  for ( var i = 0; i < file.objects.length; i++ ) {
    if ( file.objects[i].type == "paragraph" ) {
      var obj = {
        type: "paragraph"
      };
      var text = file.objects[i].text;
      text = replaceAll(text,"</div>","");
      text = replaceAll(text,"<div>","\n");
      text = replaceAll(text,"<b>","[b]");
      text = replaceAll(text,"</b>","[/b]");
      text = replaceAll(text,"&nbsp;"," ");
      text = replaceAll(text,"<","&lt;");
      text = replaceAll(text,">","&gt;");
      obj.text = text;
      objects.push(obj);
    } else {
      objects.push(file.objects[i]);
    }
  }
  var str = JSON.stringify({
    title: file.title,
    edition: file.edition,
    thumbnail: file.thumbnail,
    objects: objects
  });
  var req = new XMLHttpRequest();
  req.onload = function() {
    if ( this.responseText == "Bad Request" ) {
      alert("Failed to save the article. Please try again.");
      return;
    }
  }
  req.open("POST",`/generator/server_access/save_dev_article.php?index=${sessionStorage.getItem("index")}`);
  req.send(str);
}

window.onload = function() {
  var req = new XMLHttpRequest();
  req.onload = function() {
    if ( this.responseText == "Bad Request" ) {
      alert("Failed to load the article. Please try again.");
      return;
    } else {
      file = JSON.parse(this.responseText);
      document.getElementById("title").value = file.title;
      document.getElementById("edition").value = file.edition;
      if ( file.thumbnail ) document.getElementById("thumbnailButton").innerText = "Nustatyt Paveiksla ✓";
      for ( var i = 0; i < file.objects.length; i++ ) {
        if ( file.objects[i].type == "paragraph" ) {
          var text = file.objects[i].text;
          text = replaceAll(text,"\n","<div>");
          text = replaceAll(text,"[b]","<b>");
          text = replaceAll(text,"[/b]","</b>");
          text = replaceAll(text," ","&nbsp;");
          console.log(text);
          file.objects[i].text = text;
        }
      }
      renderScreen();
    }
  }
  req.open("GET",`/generator/server_access/load_dev_article.php?index=${sessionStorage.getItem("index")}`);
  req.send();
  document.getElementById("title").onchange = function() {
    file.title = this.value;
  }
  document.getElementById("edition").onchange = function() {
    file.edition = this.value;
  }
}
