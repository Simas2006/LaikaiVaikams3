<?php
$path = "../../../editions/post_edition";
$obj = @fopen($path,"r") or die("Error 1");
$edata = explode(",",trim(fread($obj,filesize($path))));
$ename = $edata[0];
$etitle = $edata[1];
fclose($obj);

chdir("../../../editions");
rename("dev_version.json",$ename . ".json");

$path = "dev_version.json";
$obj = @fopen($path,"w") or die("Error 2");
$dev_data = '[{"title":"","state":0,"thumbnail":null,"objects":[],"glossary":[]},{"title":"","state":0,"thumbnail":null,"objects":[],"glossary":[]},{"title":"","state":0,"thumbnail":null,"objects":[],"glossary":[]},{"title":"","state":0,"thumbnail":null,"objects":[],"glossary":[]},{"title":"","state":0,"thumbnail":null,"objects":[],"glossary":[]},{"title":"","state":0,"thumbnail":null,"objects":[],"glossary":[]}]';
fwrite($obj,$dev_data);
fclose($obj);

$path = "manifest.json";
$obj = @fopen($path,"r") or die("Error 3");
$jsonObj = json_decode(fread($obj,filesize($path)));
$manifestObj = (object) ["file" => $ename,"edition" => $etitle,"timestamp" => time()];
array_push($jsonObj,$manifestObj);
fclose($obj);
$obj = @fopen($path,"w") or die("Error 4");
fwrite($obj,json_encode($jsonObj,JSON_PRETTY_PRINT));
fclose($obj);

unlink("post_edition") or die("Error 5");
echo "Success";
?>
