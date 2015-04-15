<?php
// other files cant access this because its private
// We are making a Class to make an Object
class Database {
	private $connection;
	private $host;
	private $username;
	private $password;
	private $database;
	public $error;
// this code can be reused
	public function __construct($host, $username, $password, $database){
		$this->host = $host;
		$this->username = $username;
		$this->password = $password;
		$this->database = $database;
	 $this->connection = new mysqli($host, $username, $password);
         
	 if ($this->connection->connect_error) {
	 	die("<p>Error: " . $connection->connect_error . "</p>");
	 }
	  // Selects the database
	  $exists = $this->connection->select_db($database);
	    
	   if (!$exists) {
	   	// Sends actions to the Databases
	   	$query = $this->connection->query("CREATE DATABASE $database");
	    // Checks if the database has been created
	   	if ($query) {
                    
		  echo "<p>Successfully created a database: " . $database . "</p>";     
	   	}
	   }
	}
// Function that opens the connection
	public function openConnection(){
		$this->connection = new mysqli($this->host, $this->username, $this->password, $this->database);
// If there is an error this echos out the error
 	if ($this->connection->connect_error) {
 		die("<p>Error: " . $this->connection->connect_error . "</p>");
 }
	}
// This closes the function
	public function closeConnection(){
		// this checks if the connection was set
		if (isset($this->connection)) {
			// My new close function
			$this->connection->close();
		}
	}
// Creates a query
	public function query($string){
		// Calls on the openConnection function which runs the lines of code in it.
		// Basically, we opened the connection
		$this->openConnection();
		// Queried the Database
		$query = $this->connection->query($string);
		if (!$query) {
			$this->error = $this->connection->error;
		}
		// We closed the conncection
		$this->closeConnection();
		return $query;
	}
}