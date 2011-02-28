$(function() {

	var
		pendingRequestCounter = 0
	;
	
	// Configure the notification system
	$.n.defaults.timeout = 3000;
	
	// Configure Ajax
	var ajaxSettings = {
		// err probs here
		maxRetry: 5,
		timeout: 5000
	};
	$.ajaxSetup({
		timeout: ajaxSettings.timeout
	});
	
	$('#header').before('<div style="height: 41px; background-color: purple;"></div>');
	
	window.onbeforeunload = function(e) {
		var e = e || window.event;
		if (pendingRequestCounter) {
			/* if (e) // OK: MyFF, MyIE; KO: Opera 10.63, MyChrome
				e.returnValue = ...; */
			return 'If you leave now there are ' + pendingRequestCounter + ' faves that could be lost'; // Safari?, MyChrome:Ok, MyFF:Ok, MyIE:Ok, Opera 10.63: Ko
		}
	};
	
	
	$('#collect-checkbox').button({
		icons: {
			primary: 'ui-icon-star'
		}
	}).change(function() {
		if ($(this).attr('checked')) {
			$('#header').addClass('sticky');
			$('#collections').slideDown(500);
		}
		else {
			$('#header').removeClass('sticky');
			$('#collections').slideUp(500);
		}
	});
	
	/* function showCollections() {
		if ($(window).scrollTop())
			$('#header').css('top', $(window).scrollTop());
	}
	function hideCollections() {
		$('#header').css('top', 0);
	} */

    $('.gallery .thumb').draggable({
		revert: 'invalid',
		helper: 'clone',
		opacity: 0.7,
		//cancel: 'img',
		cursor: 'move',
		zIndex: 100,
		start: function(e, ui) {
			$('#collect-checkbox').attr('checked', true).change();
		}
    });

	$('#collections .collection').each(function() {
		$(this).droppable({
			hoverClass: 'drop-hover',
			activeClass: 'drop-active',
			accept: ':not(.' + this.id + ')',
			drop: function(e, ui) {
				var
					$img = $('img', ui.draggable),
					picTitle = $img.attr('title'),
					collectionId = this.id,
					retryCounter = 0
				;

				log('Dropped ' + picTitle + ' on collection ' + collectionId);
				
				// Send the fave to the server
				pendingRequestCounter++;
				$.ajax('/php/fave.php', {
					data: {item: picTitle, coll: collectionId}, 
					success: function(data, textStatus, jqXHR) {
						$.n.success(picTitle + ' added to collection ' + collectionId);
						pendingRequestCounter--;
					},
					error: function(jqXHR, textStatus, errorThrown) { 
						log('Ajax failure: Could not add "' + picTitle + ' to "' + collectionId + '", try: ' + retryCounter + ': ' + textStatus + errorThrown + jqXHR);
						$.n.warning('Could not save "' + picTitle + ' to "' + collectionId + '", try: ' + retryCounter + '/' + ajaxSettings.maxRetry);
						if (retryCounter >= ajaxSettings.maxRetry) {
							$.n.error('Could not save "' + picTitle + '" to "' + collectionId);
							$('#' + collectionId + ' .faves li img[title=' + picTitle + ']').parent().remove();
						}
						else {
							retryCounter++;
							$.ajax('/php/fave.php', this);
						}
					}
				});
				
				// Drop it on its collection
				appendFaveToCollection(picTitle, $img.width() / $img.height(), collectionId);
			}
		});
    });
	
	fetchUserCollections();
	
	
	function appendFaveToCollection(picTitle, aspectRatio, collectionName) {
		log('appendFaveToCollection: ' + picTitle + ', ' + aspectRatio + ', ' + collectionName);
		var 
			scaleFactor = 0.8,
			favesWidth = 98.0,
			favesHeight = 78.0
		;
		
		var scaledWidth, scaledHeight;
		if (aspectRatio > 1.0) {
			scaledWidth = scaleFactor * favesWidth;
			scaledHeight = scaledWidth / aspectRatio;
		}
		else {
			scaledHeight = scaleFactor * favesHeight;
			scaledWidth = scaledHeight * aspectRatio
		}
				
		log('scaledWidth: ' + scaledWidth);
		log('scaledHeight: ' + scaledHeight);

		var thumbPos = random.pointInRect([2, favesWidth-scaledWidth], [2, favesHeight-scaledHeight]);
		
		$('#' + collectionName + ' .faves').append(
			'<li class="fave" style="top: ' + thumbPos.y + 'px; left: ' + thumbPos.x + 'px;">'
			+ '<img src="img/photoset/' + picTitle + '-tn.jpg" title="' + picTitle + '" style="width: ' + scaledWidth + 'px; height: ' + scaledHeight + 'px;">'
			//+ '<img src="/img/pic/' + picTitle + '-tn.jpg" style="' + (imgWidth>imgHeight)? ('width: ' + scaleFactor*imgWidth + 'px;">') : ('height: ' + scaleFactor*imgHeight + 'px;"'); 
			+ '</li>');
			
		// Mark the thumb as added to the collection
		$('.gallery li img[title=' + picTitle + ']').parent().parent().addClass(collectionName);
	}

	function fetchUserCollections() {
		var
			retryCounter = 0
		;
		
		$.n('Loading faves, DnD disabled');
		$('.gallery .thumb').draggable('option', 'disabled', true);
		$('#collect-checkbox').button('option', 'disabled', true);
		
		$.ajax('/php/get-collection.php', {
			//data: {id: 'anime'},
			//dataType: 'json',
			success: function(data, textStatus, jqXHR) {
				var 
					collections = $.parseJSON(data),
					numCollections = collections.length,
					i = 0
				;

				log(collections);
				
				for (i = 0; i < numCollections; ++i) {
					var c = collections[i];
					var cName = c.name;
					var cFaves = c.faves;
					var numFaves = cFaves.length;
					for (var j = 0; j < numFaves; ++j) {
						appendFaveToCollection(cFaves[j][0], cFaves[j][1], cName);
					}
				}
				
				$('.gallery .thumb').draggable('option', 'disabled', false);
				$('#collect-checkbox').button('option', 'disabled', false);
				$.n('Faves loaded, DnD enabled');
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$.n.warning('Could not load collections, retry: ' + retryCounter + '/' + ajaxSettings.maxRetry);
				if (retryCounter >= ajaxSettings.maxRetry) {
					$.n.error('Could not load collections');
				}
				else {
					retryCounter++;
					$.ajax('/php/get-collection.php', this);
				}
			}
		});
	}
	

    var random = {
		pointInRect: function(spanX, spanY) {
			return {
				x: Math.random()*(spanX[1]-spanX[0]) + spanX[0],
				y: Math.random()*(spanY[1]-spanY[0]) + spanY[0],
			};
		}
    };
	
	function log(msg) {
		if (typeof console === "undefined")
			return;
		console.log(msg);
	}

});