<?php 
    sleep(rand(1, 3));
	$code = rand() % 4;
	if($code == 3) {
	    header('HTTP/1.1 500 error');
		exit; 
	}
?>
{
"code":<?php if($code == 0) {echo 200;} else if($code == 1) {echo 400;} else if($code == 2) {echo 401;}?>,
"data": "<?php echo $_GET['data'];?>"
}