<?php
$data = file_get_contents("php://input");
if ( is_null($data) || is_null($_GET["index"]) ) die("Bad Request");
$path = "../../../editions/dev_version.json";
$obj = @fopen($path,"r") or die("Bad Request");
$jsonObj = json_decode(fread($obj,filesize($path)));
$jsonObj[$_GET["index"]] = json_decode($data) or die("Bad Request");
fclose($obj);
$obj = @fopen($path,"w") or die("Bad Request");
fwrite($obj,json_encode($jsonObj));
fclose($obj);
echo "ok";
?>
