<?php

$errPr = 50;
$errCoin = rand(0, 100);
if ($errCoin <= $errPr) {
	sleep(10);
} 

session_start();

// Auto url decoding?
$itemId = $_GET['item'];
$collection = $_GET['coll'];

$_SESSION['collections'][$collection][] = $itemId; // Here eventual deplicate check



