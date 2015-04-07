<?php
require_once(__DIR__ . "/../model/config.php");//this sets up our files

$exp = filter_input(INPUT_POST, "exp", FILTER_SANITIZE_STRING);//this filters my game
$exp1 = filter_input(INPUT_POST, "exp", FILTER_SANITIZE_STRING);
$exp2 = filter_input(INPUT_POST, "exp", FILTER_SANITIZE_STRING);
$exp3 = filter_input(INPUT_POST, "exp", FILTER_SANITIZE_STRING);
$exp4 = filter_input(INPUT_POST, "exp", FILTER_SANITIZE_STRING);


$query = $_SESSION["connection"]->query("UPDATE users SET"
        . "exp = $exp, "
        . "exp = $exp1, "
        . "exp = $exp2, "
        . "exp = $exp3, "
        . "exp = $exp4 WHERE username = \"" . $_SESSION["name"]. "\"");