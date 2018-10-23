var template = {
  "title": "sage beige",
  "objects": [
    {
      "type": "paragraph",
      "text": "hello world. my name is [b]sage[/b], this is\na newline and a [b]BOLD[/b]\n im still continuing to write"
    },
    {
      "type": "image",
      "src": "/public/images/sage.jpg",
      "caption": "this is an example of the SAG"
    },
    {
      "type": "image",
      "src": "/public/images/sage.jpg",
      "caption": "this is an example of the SAG"
    },
    {
      "type": "image",
      "src": "/public/images/sage.jpg",
      "caption": "this is an example of the SAG"
    },
    {
      "type": "image",
      "src": "/public/images/sage.jpg",
      "caption": "this is an example of the SAG"
    },
    {
      "type": "image",
      "src": "/public/images/sage.jpg",
      "caption": "this is an example of the SAG"
    },
    {
      "type": "image",
      "src": "/public/images/sage.jpg",
      "caption": "this is an example of the SAG"
    },
    {
      "type": "image",
      "src": "/public/images/sage.jpg",
      "caption": "this is an example of the SAG"
    },
    {
      "type": "image",
      "src": "/public/images/sage.jpg",
      "caption": "this is an example of the SAG"
    },
    {
      "type": "image",
      "src": "/public/images/sage.jpg",
      "caption": "this is an example of the SAG"
    },
    {
      "type": "image",
      "src": "/public/images/sage.jpg",
      "caption": "this is an example of the SAG"
    },
    
  ]
}

function renderFile(file) {
  document.getElementById("title").innerText = file.title;
  var objects = file.objects;
  var content = document.getElementById("content");
  for ( var i = 0; i < objects.length; i++ ) {
    if ( objects[i].type == "paragraph" ) {
      var text = objects[i].text;
      var p = document.createElement("p");
      while ( text.indexOf("[b]") > -1 ) {
        var span = document.createElement("span");
        span.innerText = text.slice(0,text.indexOf("[b]"));
        p.appendChild(span);
        text = text.slice(text.indexOf("[b]") + 3);
        var b = document.createElement("b");
        b.innerText = text.slice(0,text.indexOf("[/b]"));
        p.appendChild(b);
        text = text.slice(text.indexOf("[/b]") + 4);
      }
      var span = document.createElement("span");
      span.innerText = text;
      p.appendChild(span);
      content.appendChild(p);
    } else if ( objects[i].type == "image" ) {
      var p = document.createElement("p");
      p.className = "image";
      var img = document.createElement("img");
      img.src = objects[i].src;
      p.appendChild(img);
      p.appendChild(document.createElement("br"));
      var caption = document.createElement("i");
      caption.innerText = objects[i].caption;
      p.appendChild(caption);
      content.appendChild(p);
    } else if ( objects[i].type == "hline" ) {
      content.appendChild(document.createElement("hr"));
    }
  }
}

window.onload = function() {
  renderFile(template);
}
