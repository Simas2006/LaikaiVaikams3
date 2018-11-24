read -r -d "" SCRIPT <<- EOM
var file;
var load=_=>{file=JSON.parse(fs.readFileSync("$1"))};
var save=_=>{fs.writeFileSync("$1",JSON.stringify(file));process.exit()}
load();
EOM

echo "Loaded file \"$1\" into variable \`file\`. Use \`save()\` to save the file from memory and exit.";
node -i -e "$SCRIPT";
