<?php
$path = "../../../editions/dev_version.json";
$obj = @fopen($path,"r") or die("Bad Request");
$jsonObj = json_decode(fread($obj,filesize($path)));
fclose($obj);
if ( ! is_null($_GET["index"]) && $_GET["index"] != "null" ) {
  $jsonObj[$_GET["index"]] -> state++;
  $obj = @fopen($path,"w") or die("Bad Request");
  fwrite($obj,json_encode($jsonObj));
  fclose($obj);
}
$articleArr = [];
foreach ( $jsonObj as $article ) {
  $obj = (object) [
    "title" => $article -> title,
    "thumbnail" => $article -> thumbnail,
    "state" => $article -> state
  ];
  $articleArr[] = $obj;
}
echo json_encode($articleArr);
?>
