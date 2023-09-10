<?php

    include('database.php');

    $id = $_POST['id'];
    $query = "SELECT * FROM task WHERE id = $id";
    $result = mysqli_query($connection, $query);
    if(!$result) {
        die("Query Failed");
    }

    $json = array();
    while($row = mysqli_fetch_array($result)) {
        $json[] = array(
            'name' => $row['name'],
            'id' => $row['id'],
            'description' => $row['description']
        );
    }
    $jsonString = json_encode($json[0]);
    echo $jsonString;
?>