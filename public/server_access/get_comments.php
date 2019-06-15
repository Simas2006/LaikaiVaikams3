<?php
$file = $_GET["file"];
$index = $_GET["index"];
if ( is_null($file) || is_null($index) ) die("Bad Request");
if ( strpos($file,"..") !== false ) die("Bad Request");

$path = "../../editions/comments.json";
$obj = @fopen($path,"r") or die("Bad Request");
$jsonObj = json_decode(fread($obj,filesize($path)));
$comments = $jsonObj->{$file . "_" . $index};
fclose($obj);
echo json_encode($comments,true);
?>
