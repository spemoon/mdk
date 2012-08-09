<?php include('poem.php');?>
{"code":200,"data": {"time": "<?php echo time();?>", "poem": "<?php echo getPoem(time() % 8);?>"}}