<?php
$path = "../../editions/manifest.json";
$obj = @fopen($path,"r") or die("Bad Request");
$jsonObj = json_decode(fread($obj,filesize($path)));
echo json_encode($jsonObj);
?>
