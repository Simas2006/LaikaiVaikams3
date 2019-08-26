var file;

var replaceAll = (s,o,n) => s.split(o).join(n);

function runFormattingFunction(key,index) {
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
  if ( new Date().getTime() - 50 <= file.objects[index].lastFormatCall ) return;
  file.objects[index].lastFormatCall = new Date().getTime();
  setTimeout(function() {
    formattingFunctions[key]();
    file.objects[index].text = document.getElementById("object" + index).innerHTML;
  },10);
}

function renderScreen() {
  function buttonHandler(key,index) {
    return function() {
      var obj = file.objects[this["data-object-index"]];
      if ( key.startsWith("color") ) {
        var keys = Object.keys(obj.toggle);
        for ( var i = 0; i < keys.length; i++ ) {
          if ( ! keys[i].startsWith("color") ) continue;
          obj.toggle[keys[i]] = false;
        }
      }
      runFormattingFunction(key,this["data-object-index"]);
      if ( ! obj.focused ) obj.toggle[key] = ! obj.toggle[key];
    }
  }
  var content = document.getElementById("content");
  var objects = file.objects;
  var imageTable;
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
      textarea.id = "object" + i;
      textarea.onfocus = function() {
        var obj = objects[this["data-object-index"]];
        obj.focused = true;
        var keys = Object.keys(obj.toggle);
        for ( var i = 0; i < keys.length; i++ ) {
          if ( obj.toggle[keys[i]] ) obj.toggle[keys[i]] = false;
        }
      }
      textarea.onblur = function() {
        objects[this["data-object-index"]].focused = false;
      }
      div.appendChild(textarea);
      (imageTable || content).appendChild(div);
      labels = labels.concat(["B","I","U","●","●","●","●","●","●","●","●"]);
    } else if ( objects[i].type == "image" ) {
      var table = document.createElement("table");
      table.className = "imageTable";
      var row = document.createElement("tr");
      row.className = "imageRow";
      var col = document.createElement("td");
      col.className = "imageCol";
      var p = document.createElement("p");
      p.className = "image";
      var img = document.createElement("img");
      img.src = objects[i].src;
      img.style.width = (objects[i].size * .365 || 36.5) + "vw";
      img.id = "object" + i;
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
      col.appendChild(p);
      row.appendChild(col);
      table.appendChild(row);
      content.appendChild(table);
      var paragraphCol = document.createElement("td");
      paragraphCol.className = "imageCol";
      row.appendChild(paragraphCol);
      imageTable = paragraphCol;
    } else if ( objects[i].type == "hline" ) {
      var hr = document.createElement("hr");
      hr.className = "hline";
      content.appendChild(hr);
    }
    var panel = document.createElement("div");
    panel.className = "buttonPanel";
    var functions = [
      function() {
        var index = this["data-object-index"];
        var elements = [objects[index]];
        if ( elements[0].type == "image" ) elements.push(objects[index + 1]);
        var prevObjectIndex = index - 1;
        var subtractIndex = 1;
        if ( prevObjectIndex < 0 ) return;
        if ( prevObjectIndex - 1 >= 0 && objects[prevObjectIndex - 1].type == "image" ) subtractIndex = 2;
        objects.splice(index,1);
        if ( elements.length >= 2 ) objects.splice(index,1);
        objects.splice(index - subtractIndex,0,elements[0]);
        if ( elements.length >= 2 ) objects.splice(index - subtractIndex + 1,0,elements[1]);
        renderScreen();
      },
      function() {
        var index = this["data-object-index"];
        var elements = [objects[index]];
        if ( elements[0].type == "image" ) elements.push(objects[index + 1]);
        var nextObjectIndex = index + elements.length;
        var addIndex = 1;
        if ( nextObjectIndex >= objects.length ) return;
        if ( objects[nextObjectIndex].type == "image" ) addIndex = 2;
        objects.splice(index,1);
        if ( elements.length >= 2 ) objects.splice(index,1);
        objects.splice(index + addIndex,0,elements[0]);
        if ( elements.length >= 2 ) objects.splice(index + addIndex + 1,0,elements[1]);
        renderScreen();
      },
      function() {
        var element = objects[this["data-object-index"]];
        objects.splice(this["data-object-index"],element.type == "image" ? 2 : 1);
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
    var isImagePara = objects[i].type == "paragraph" && imageTable;
    if ( isImagePara ) {
      labels = labels.slice(3);
      functions = functions.slice(3);
    }
    for ( var j = 0; j < labels.length; j++ ) {
      var button = document.createElement("button");
      button.innerText = labels[j];
      button["data-object-index"] = i;
      button.className = `label${j + (isImagePara ? 3 : 0)}`;
      button.id = `label${j + (isImagePara ? 3 : 0)}:${i}`
      button.onclick = functions[j];
      panel.appendChild(button);
    }
    if ( isImagePara ) {
      imageTable.appendChild(panel);
      imageTable = null;
    } else {
      content.appendChild(panel);
    }
    if ( objects[i].type == "image" ) {
      var slider = document.createElement("input");
      slider.type = "range";
      slider.min = "1";
      slider.max = "100";
      slider.value = objects[i].size || "100";
      slider["data-object-index"] = i;
      slider.oninput = function() {
        objects[this["data-object-index"]].size = this.value;
        document.getElementById("object" + this["data-object-index"]).style.width = (this.value * .365 || 36.5) + "vw";
      }
      slider.onmouseup = renderScreen;
      panel.appendChild(slider);
    }
  }
}

function addParagraph() {
  file.objects.push({
    "type": "paragraph",
    "text": "",
    "focused": false,
    "lastFormatCall": 0,
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
        "caption": "",
        "size": 100
      });
      file.objects.push({
        "type": "paragraph",
        "text": "",
        "focused": false,
        "lastFormatCall": 0,
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
  input2.placeholder = "Žodžio Reikšmė";
  if ( textdata ) input2.value = textdata[1];
  col2.appendChild(input2);
  row.appendChild(col2);
  var col3 = document.createElement("td");
  var input3 = document.createElement("input");
  input3.type = "text";
  input3.placeholder = "Žodis Angliškai";
  if ( textdata ) input3.value = textdata[2];
  col3.appendChild(input3);
  row.appendChild(col3);
  var col4 = document.createElement("td");
  var button = document.createElement("button");
  button.className = "remove";
  button.innerText = "X";
  button.onclick = function() {
    var row = this.parentElement.parentElement;
    row.parentElement.removeChild(row);
  }
  col4.appendChild(button);
  row.appendChild(col4);
  document.getElementById("glossary").appendChild(row);
}

function saveGlossary() {
  var elements = Array.prototype.slice.call(document.getElementById("glossary").children).slice(1);
  elements = elements.map(item => [
    item.children[0].children[0].value,
    item.children[1].children[0].value,
    item.children[2].children[0].value
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

function saveFile(callback) {
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
    if ( callback ) callback();
  }
  req.open("POST",`../server_access/save_dev_article.php?index=${sessionStorage.getItem("index")}`);
  req.send(str);
}

function showDevVersion() {
  saveFile(function() {
    sessionStorage.setItem("file","dev_version");
    location.href = "../../article/index.html";
  });
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
  req.open("GET",`../server_access/load_dev_article.php?index=${sessionStorage.getItem("index")}`);
  req.send();
  document.getElementById("title").onchange = function() {
    file.title = this.value;
  }
  if ( sessionStorage.getItem("reloadfromsave") ) {
    sessionStorage.removeItem("reloadfromsave");
    location.reload();
  }
}
