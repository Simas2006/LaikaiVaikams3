<?php
$path = "../../../editions/dev_version.json";
$obj = @fopen($path,"r") or die("Bad Request");
$jsonObj = json_decode(fread($obj,filesize($path)));
fclose($obj);
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
