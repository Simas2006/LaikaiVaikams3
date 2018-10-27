function addImage() {
  var picker = document.getElementById("filePicker");
  picker.onchange = function() {
    var imageObj = document.getElementById("uploaded");
    var file = this.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
      imageObj.src = reader.result;
    }
    if ( file ) {
      if ( file.name.toLowerCase().endsWith(".jpg") || file.name.toLowerCase().endsWith(".png") || file.name.toLowerCase().endsWith(".tiff") ) reader.readAsDataURL(file);
      else console.log("File of invalid type");
    }
  }
  picker.click();
}
