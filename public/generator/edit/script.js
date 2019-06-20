var file;

var replaceAll = (s,o,n) => s.split(o).join(n);

function runFormattingFunction(key) {
  var formattingFunctions = {
    "bold": function() {
      document.execCommand("bold");
    },
    "italic": function() {
      document.execCommand("italic");
    },
    "underline": function() {
      document.execCommand("underline");
    },
    "colorblack": function() {
      document.execCommand("styleWithCSS",false,true);
      document.execCommand("foreColor",false,"black");
    },
    "colorred": function() {
      document.execCommand("styleWithCSS",false,true);
      document.execCommand("foreColor",false,"red");
    },
    "colororange": function() {
      document.execCommand("styleWithCSS",false,true);
      document.execCommand("foreColor",false,"orange");
    },
    "coloryellow": function() {
      document.execCommand("styleWithCSS",false,true);
      document.execCommand("foreColor",false,"yellow");
    },
    "colorgreen": function() {
      document.execCommand("styleWithCSS",false,true);
      document.execCommand("foreColor",false,"#00ff00");
    },
    "colorlblue": function() {
      document.execCommand("styleWithCSS",false,true);
      document.execCommand("foreColor",false,"#00ddff");
    },
    "colorblue": function() {
      document.execCommand("styleWithCSS",false,true);
      document.execCommand("foreColor",false,"blue");
    },
    "colorpurple": function() {
      document.execCommand("styleWithCSS",false,true);
      document.execCommand("foreColor",false,"purple");
    },
  }
  setTimeout(function() {
    formattingFunctions[key]();
  },10);
}

function renderScreen() {
  function buttonHandler(key,index) {
    return function() {
      var obj = file.objects[this["data-object-index"]];
      if ( key.startsWith("color") ) {
        var keys = Object.keys(obj.active);
        for ( var i = 0; i < keys.length; i++ ) {
          if ( ! keys[i].startsWith("color") ) continue;
          obj.active[keys[i]] = false;
          obj.toggle[keys[i]] = false;
        }
      }
      if ( obj.focused ) {
        runFormattingFunction(key);
        obj.active[key] = ! obj.active[key];
      } else {
        obj.toggle[key] = ! obj.toggle[key];
      }
      var keys = Object.keys(obj.active);
      for ( var i = 3; i < keys.length + 3; i++ ) {
        if ( obj.active[keys[i - 3]] ^ obj.toggle[keys[i - 3]] ) {
          document.getElementById(`label${i}:${index}`).classList.add("active");
        } else {
          document.getElementById(`label${i}:${index}`).classList.remove("active");
        }
      }
    }
  }
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
        var keys = Object.keys(obj.toggle);
        for ( var i = 0; i < keys.length; i++ ) {
          if ( obj.toggle[keys[i]] ) {
            obj.active[keys[i]] = ! obj.active[keys[i]];
            obj.toggle[keys[i]] = false;
            runFormattingFunction(keys[i]);
          }
        }
      }
      textarea.onblur = function() {
        objects[this["data-object-index"]].focused = false;
      }
      div.appendChild(textarea);
      content.appendChild(div);
      labels = labels.concat(["B","I","U","●","●","●","●","●","●","●","●"]);
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
      buttonHandler("bold",i),
      buttonHandler("italic",i),
      buttonHandler("underline",i),
      buttonHandler("colorblack",i),
      buttonHandler("colorred",i),
      buttonHandler("colororange",i),
      buttonHandler("coloryellow",i),
      buttonHandler("colorgreen",i),
      buttonHandler("colorlblue",i),
      buttonHandler("colorblue",i),
      buttonHandler("colorpurple",i)
    ];
    for ( var j = 0; j < labels.length; j++ ) {
      var button = document.createElement("button");
      button.innerText = labels[j];
      button["data-object-index"] = i;
      button.className = `label${j}`;
      button.id = `label${j}:${i}`
      button.onclick = functions[j];
      panel.appendChild(button);
    }
    content.appendChild(panel);
    if ( objects[i].type == "paragraph" ) {
      setTimeout(function(index) {
        var keys = Object.keys(objects[index].active);
        for ( var j = 3; j < keys.length + 3; j++ ) {
          if ( objects[index].active[keys[j - 3]] ^ objects[index].toggle[keys[j - 3]] ) {
            document.getElementById(`label${j}:${index}`).classList.add("active");
          } else {
            document.getElementById(`label${j}:${index}`).classList.remove("active");
          }
        }
      }.bind(null,i),10);
    }
  }
}

function addParagraph() {
  file.objects.push({
    "type": "paragraph",
    "text": "",
    "focused": false,
    "active": {
      "bold": false,
      "italic": false,
      "underline": false,
      "colorblack": true,
      "colorred": false,
      "colororange": false,
      "coloryellow": false,
      "colorgreen": false,
      "colorlblue": false,
      "colorblue": false,
      "colorpurple": false
    },
    "toggle": {
      "bold": false,
      "italic": false,
      "underline": false,
      "colorblack": false,
      "colorred": false,
      "colororange": false,
      "coloryellow": false,
      "colorgreen": false,
      "colorlblue": false,
      "colorblue": false,
      "colorpurple": false
    }
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

function addGlossaryItem(textdata) {
  var row = document.createElement("tr");
  var col1 = document.createElement("td");
  var input1 = document.createElement("input");
  input1.type = "text";
  input1.placeholder = "Žodis Lietuviškai";
  if ( textdata ) input1.value = textdata[0];
  col1.appendChild(input1);
  row.appendChild(col1);
  var col2 = document.createElement("td");
  var input2 = document.createElement("input");
  input2.type = "text";
  input2.placeholder = "Žodis Angliškai";
  if ( textdata ) input2.value = textdata[1];
  col2.appendChild(input2);
  row.appendChild(col2);
  var col3 = document.createElement("td");
  var button = document.createElement("button");
  button.className = "remove";
  button.innerText = "X";
  button.onclick = function() {
    var row = this.parentElement.parentElement;
    row.parentElement.removeChild(row);
  }
  col3.appendChild(button);
  row.appendChild(col3);
  document.getElementById("glossary").appendChild(row);
}

function saveGlossary() {
  var elements = Array.prototype.slice.call(document.getElementById("glossary").children).slice(1);
  elements = elements.map(item => [
    item.children[0].children[0].value,
    item.children[1].children[0].value
  ]);
  file.glossary = elements;
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
      var obj = file.objects[i];
      var text = obj.text;
      text = replaceAll(text,"</div>","");
      text = replaceAll(text,"<div>","\n");
      text = replaceAll(text,"&nbsp;"," ");
      obj.text = text;
      objects.push(obj);
    } else {
      objects.push(file.objects[i]);
    }
  }
  saveGlossary();
  var str = JSON.stringify({
    title: file.title,
    edition: file.edition,
    state: file.state,
    thumbnail: file.thumbnail,
    objects: objects,
    glossary: file.glossary
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
      if ( file.thumbnail ) document.getElementById("thumbnailButton").innerText = "Nustatyt Paveiksla ✓";
      for ( var i = 0; i < file.objects.length; i++ ) {
        if ( file.objects[i].type == "paragraph" ) {
          var text = file.objects[i].text;
          text = replaceAll(text,"\n","<div>");
          file.objects[i].text = text;
        }
      }
      for ( var i = 0; i < file.glossary.length; i++ ) {
        addGlossaryItem(file.glossary[i]);
      }
      renderScreen();
    }
  }
  req.open("GET",`/generator/server_access/load_dev_article.php?index=${sessionStorage.getItem("index")}`);
  req.send();
  document.getElementById("title").onchange = function() {
    file.title = this.value;
  }
}
