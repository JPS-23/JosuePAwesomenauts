<?php

require_once(__DIR__ . '/../model/config.php');

$query = $_SESSION["connection"]->query("CREATE TABLE users ("
        ."id int(11) NOT NULL AUTO_INCREMENT,"
        ."username varchar(30) NOT NULL,"
        ."email varchar(50) NOT NULL,"
        ."password char(128) NOT NULL,"
        ."salt char(128) NOT NULL,"
        . "exp int(4),"//this is
        . "exp1 int(4),"//for the 
        . "exp2 int(4),"//four experience
        . "exp3 int(4),"//files that
        . "exp4 int(4),"//are in the project
        ."PRIMARY KEY (id))");

if ($query) {
    echo "<p>successfully created users table</p>";
} else {
    echo "<p>" . $_SESSION["connection"]->error . "</p>";
}