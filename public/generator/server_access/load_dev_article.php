<?php
if ( is_null($_GET["index"]) ) die("Bad Request");
$path = "../../../editions/dev_version.json";
$obj = @fopen($path,"r") or die("Bad Request");
$jsonObj = json_decode(fread($obj,filesize($path)));
fclose($obj);
echo json_encode($jsonObj[$_GET["index"]]);
?>
