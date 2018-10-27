function selectFile() {
  var imageObj = document.getElementById("uploaded");
  var file = document.getElementById("filePicker").files[0];
  var reader = new FileReader();
  reader.onloadend = function() {
    imageObj.src = reader.result;
  }
  if ( file ) {
    if ( file.name.toLowerCase().endsWith(".jpg") || file.name.toLowerCase().endsWith(".png") || file.name.toLowerCase().endsWith(".tiff") ) reader.readAsDataURL(file);
  }
}
