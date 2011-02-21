<?php session_start(); ?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

<html>
	<head>
		<title>DnDfaves - Favorites and collections with drag and drop - jQuery UI version</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/3.3.0/build/cssreset/reset-min.css">
		<link rel="stylesheet" type="text/css" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/themes/dark-hive/jquery-ui.css">
		<link rel="stylesheet" type="text/css" href="js/jquery.notifications.css">
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<script src="http://code.jquery.com/jquery-1.5.js"></script>
		<script>
			jQuery.fn.clone = function( dataAndEvents, deepDataAndEvents ) {
				dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
				deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

				return this.map( function () {
					return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
				});
			};
		</script>
		<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.js"></script>
		<script src="js/jquery.notifications-1.1.js"></script>
		<script src="js/script.js"></script>
	</head>

	<body>
    
		<div id="header">
			<h1><a href="/">DnDFaves</a></h1>
			<input id="searchbox" type="text" value="search">
			<label id="collect-button-label" for="collect-checkbox">Collect </label><input type="checkbox" id="collect-checkbox">
			<!--<ul id="toolbar">
				<li id="logo"><h1><a href="/">DnDFaves</a></h1></li>
				<li id="search-box"><input type="text" value="search"></li>
				<li id="collect-button"><label for="collect-checkbox">Collect </label><input type="checkbox" id="collect-checkbox"></li>
				<li>test 1</li>
				<li>test 2</li>
				<li><input type="text"></li>
			</ul>-->
			<ul id="collections">
				<?php
					$collections = array(
						'Planets',
						'Stars',
						'Vehicles',
						'Missions',
						'Mars',
						'Earth',
						'Satellites',
						'Shuttle',
						'Moon',
						'Nebule',
						'Galaxies',
					);
					
					foreach ($collections as $c) {
						?>
						<li class="collection" id="<?php echo $c; ?>">
							<h5 class="header"><?php echo $c; ?></h5>
							<ol class="faves"></ol>
						</li>
						<?php
					} ?>
			</ul>
		</div>
    
		<div id="page-wrap">
			<div id="sidebar">
				<ul>
					<li>Categories
						<ul>
							<li><a href="#">Digital Art</a></li>
							<li><a href="#">Photography</a></li>
							<li><a href="#">Traditional Art</a></li>
						</ul>
					</li>
					<li>Explore
						<ul>
							<li><a href="#">Groups</a></li>
							<li><a href="#">Tags</a></li>
						</ul>
					</li>
					<li>Shops
						<ul>
							<li><a href="#">Prints</a></li>
							<li><a href="#">T-shirts</a></li>
						</ul>
					</li>
				</ul>
			</div>
			
			<div id="content">
				<ul class="gallery">
					<?php
						// Assume that all images are JPGs
						foreach (glob('img/photoset/*-tn.*') as $filePath) {
							$fileNameAndExt = basename($filePath);
							$picTitle = substr($fileNameAndExt, 0, strlen($fileNameAndExt)-strlen('-tn.jpg'));
							
							$info = getimagesize($filePath); 
							$_SESSION['aspectRatios'][$picTitle] = (float)$info[0] / (float)$info[1];
							$style = '';
							if ($info[0] > $info[1]) {
								// Landscape format
								$style .= "margin: " . ((110-$info[1])/2) . "px 5px";
							}
							else {
								// Portrait format
								$style .= "margin: 5px " . ((110-$info[0])/2) . "px";
							}
							
							$out = '';
							$out .= '<li class="thumb" title="Drag me to your collections!">';
							$out .= '<a href="img/photoset/' . $picTitle . '.jpg">';
							$out .= '<img src="' . $filePath . '" style="' . $style . '" title="' . $picTitle . '">';
							$out .= "</a></li>\n";
							
							echo $out;
						}
					?>
				</ul>
			</div>
		</div>

		<div id="footer">
			<a href="http://webdevdemos.sourceforge.net">Source Code</a>
			<a href="http://giuliom.users.sourceforge.net">Notes</a>
			<span>Photoset from <a href="http://www.nasa.gov/multimedia/imagegallery/">Nasa</a></span>
		</div>
    
  </body>
</html>
