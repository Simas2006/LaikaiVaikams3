var file = {
  objects: []
}

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
        document.execCommand("bold");
        objects[this["data-object-index"]].boldSet = ! objects[this["data-object-index"]].boldSet;
        if ( objects[this["data-object-index"]].boldSet ) this.style.fontWeight = "bold";
        else this.style.fontWeight = "normal";
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
    "boldSet": false
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
