function addParagraph() {
  var textarea = document.createElement("textarea");
  textarea.onkeydown = textarea.onkeyup = function() {
    this.style.height = "1px";
    this.style.height = this.scrollHeight + "px";
  }
  textarea.placeholder = "Tekstas...";
  textarea.className = "paragraph";
  document.getElementById("content").appendChild(textarea);
}

function addImage() {
  var picker = document.getElementById("filePicker");
  picker.onchange = function() {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
      var p = document.createElement("p");
      p.className = "image";
      var img = document.createElement("img");
      img.src = reader.result;
      p.appendChild(img);
      p.appendChild(document.createElement("br"));
      var caption = document.createElement("input");
      caption.className = "caption";
      p.appendChild(caption);
      document.getElementById("content").appendChild(p);
    }
    if ( file ) {
      if ( file.name.toLowerCase().endsWith(".jpg") || file.name.toLowerCase().endsWith(".png") || file.name.toLowerCase().endsWith(".tiff") ) reader.readAsDataURL(file);
    }
  }
  picker.click();
}
