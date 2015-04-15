<?php
    require_once(__DIR__ . "/Database.php");
    session_start();
    //prevents hackers from hacking into a session without loggin in
    session_regenerate_id(true);
    
    $path = '/JosuePAwesomenauts/php/';//this sets up a new destination
    
    $host = "localhost";
    $username = "root";
    $password = "";
    $database = "awesomenauts_db";//this is the name of the project
    
    if(!isset($_SESSION["connection"])){
        echo "session";
        $connection = new Database($host, $username, $password, $database);
        $_SESSION["connection"] = $connection;
    }