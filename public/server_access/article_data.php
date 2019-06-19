<?php
$file = $_GET["file"];
$index = $_GET["index"];
if ( is_null($file) || is_null($index) ) die("Bad Request");
if ( strpos($file,"..") !== false ) die("Bad Request");

$path = "../../editions/" . $file . ".json";
$obj = @fopen($path,"r") or die("Bad Request");
$jsonObj = json_decode(fread($obj,filesize($path)),true);
$articleObj = $jsonObj[$index];
fclose($obj);

$path = "../../editions/manifest.json";
$obj = @fopen($path,"r") or die("Bad Request");
$manifestObj = json_decode(fread($obj,filesize($path)),true);
foreach ( $manifestObj as $entry ) {
  if ( $entry["file"] == $file ) $manifestEntry = $entry;
}
$articleObj["edition"] = $manifestEntry["edition"];
fclose($obj);
echo json_encode($articleObj);
?>
