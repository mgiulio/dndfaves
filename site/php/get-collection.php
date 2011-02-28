<?php

$errPr = 50;
$errCoin = rand(0, 100);
if ($errCoin <= $errPr) {
	sleep(10);
}

session_start();

$out = array();
function cb($picTitle) {
	return array($picTitle, $_SESSION['aspectRatios'][$picTitle]);
}
foreach ($_SESSION['collections'] as $name => $faves) { // Need to return only last n(GET parameter?) faves
	$out[] = array('name' => $name, 'faves' => array_map('cb', $faves));
}

require_once 'Zend/Json.php';
echo Zend_Json::encode(($out)? $out : array());

/*
$collectionId = $_GET['id'];
require_once 'Zend/Json.php';
$itemIds = $_SESSION[$collectionId];
echo Zend_Json::encode(($itemIds)? $itemIds : array());
*/