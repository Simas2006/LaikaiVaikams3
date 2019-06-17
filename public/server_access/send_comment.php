<?php
$data = file_get_contents("php://input");
if ( is_null($data) || $data === "" || is_null($_GET["name"]) || $_GET["name"] === "" || is_null($_GET["index"]) ) die("Bad Request");
if ( strlen($data) > 250 || strlen($_GET["name"]) > 50 ) die("Bad Request");

$path = "../../editions/comments.json";
$obj = @fopen($path,"r") or die("Bad Request");
$jsonObj = json_decode(fread($obj,filesize($path)));

$comment = (object) ["name" => $_GET["name"],"content" => $data];
array_unshift($jsonObj->{$_GET["file"] . "_" . $_GET["index"]},$comment);
fclose($obj);
$obj = @fopen($path,"w") or die("Bad Request");
fwrite($obj,json_encode($jsonObj));
fclose($obj);
echo "ok";
?>
