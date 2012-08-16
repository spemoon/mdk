<?php
header('Content-type: application/json');
$fn = (isset($_SERVER['HTTP_X-FILENAME']) ? $_SERVER['HTTP_X-FILENAME'] : false);
if ($fn) {
    $id = rand(100000, 999999);
    file_put_contents("./data/$fn", file_get_contents("php://input"));
    echo '{"code": 200, "data": {"id": "'.$id.'"}}';
}