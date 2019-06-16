<?php
$data = file_get_contents("php://input");
if ( is_null($data) || is_null($_GET["index"]) ) die("Bad Request");
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
