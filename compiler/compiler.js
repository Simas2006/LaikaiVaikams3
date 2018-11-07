var fs = require("fs");

fs.readdir(__dirname,function(err,files) {
  if ( err ) throw err;
  files = files.filter(item => item.endsWith(".json"));
  var objects = [];
  for ( var i = 0; i < files.length; i++ ) {
    var str = fs.readFileSync(__dirname + "/" + files[i]);
    str = Buffer.from(str.toString(),"base64").toString();
    objects.push(JSON.parse(str));
  }
  var data = JSON.stringify(objects);
  var name = objects[0].edition;
  if ( name.indexOf("..") > -1 ) throw new Error(`".." found in edition name`);
  name = name.split(" m. ").join("_");
  fs.writeFile(`${__dirname}/${name}.json`,data,function(err) {
    if ( err ) throw err;
    console.log(`Successfully compiled exports into "${name}.json"\n`);
    var manifest_obj = {
      file: name,
      edition: objects[0].edition,
      timestamp: new Date().getTime()
    }
    console.log(`Add following text to manifest.json:\n\n${JSON.stringify(manifest_obj,null,2)}`);
  });
});
