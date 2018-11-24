<?php
$file = $_GET["file"];
if ( is_null($file) ) die("Bad Request");
if ( strpos($file,"..") !== false ) die("Bad Request");

$setFile = false;
if ( $file == "latest" ) {
  $obj = @fopen("../../editions/manifest.json","r") or die("Bad Request");
  $jsonObj = json_decode(fread($obj,filesize("../../editions/manifest.json")));
  $element = $jsonObj[count($jsonObj) - 1];
  $file = $element -> file;
  $setFile = true;
}

$path = "../../editions/" . $file . ".json";
$obj = @fopen($path,"r") or die("Bad Request");
$jsonObj = json_decode(fread($obj,filesize($path)));
$articleArr = [];
foreach ( $jsonObj as $article ) {
  $obj = (object) [
    "title" => $article -> title,
    "thumbnail" => $article -> thumbnail
  ];
  $articleArr[] = $obj;
}
$outputObj = (object) [
  "edition" => $jsonObj[0] -> edition,
  "articles" => $articleArr
];
if ( $setFile ) $outputObj -> setFile = $file;
echo json_encode($outputObj);
?>
