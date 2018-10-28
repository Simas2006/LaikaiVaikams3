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
    if ( objects[i].type == "paragraph" ) {
      var div = document.createElement("div");
      var textarea = document.createElement("textarea");
      textarea["data-object-index"] = i;
      textarea.onkeydown = textarea.onkeyup = function() {
        this.rows = this.value.split("\n").length;
        objects[this["data-object-index"]].text = this.value;
      }
      textarea.value = objects[i].text;
      textarea.placeholder = "Zodziai...";
      textarea.className = "paragraph";
      textarea.rows = textarea.value.split("\n").length;
      div.appendChild(textarea);
      content.appendChild(div);
      var panel = document.createElement("div");
      panel.className = "buttonPanel";
      var labels = ["↑","↓","X","B"];
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
      content.appendChild(document.createElement("hr"));
    }
  }
}

function addParagraph() {
  file.objects.push({
    "type": "paragraph",
    "text": ""
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
