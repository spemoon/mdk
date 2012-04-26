<!DOCTYPE HTML>
<html>
    <head>
        <meta charset="UTF-8">
        <title>cross domain data</title>
    </head>
    <body>
    	<?php sleep(3);?>
    	<script>
    		window.name = 'hello,<?php echo $_GET["name"]?>';
    	</script>
    </body>
</html>