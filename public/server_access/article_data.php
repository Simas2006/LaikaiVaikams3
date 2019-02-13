<?php
$file = $_GET["file"];
$index = $_GET["index"];
if ( is_null($file) || is_null($index) ) die("Bad Request");
if ( strpos($file,"..") !== false ) die("Bad Request");

$path = "../../editions/" . $file . ".json";
$obj = @fopen($path,"r") or die("Bad Request");
$jsonObj = json_decode(fread($obj,filesize($path)));
$articleObj = $jsonObj[$index];
fclose($obj);
echo json_encode($articleObj);
?>
