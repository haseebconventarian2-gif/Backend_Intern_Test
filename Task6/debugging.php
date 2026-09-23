<?php
// Task 6
// Debugging & Problem Solving


//Problem:
//The original code tries to return $users[$id] directly.
//The users array only contains IDs 1, 2, and 3.
//When getUser(5) is called, ID 5 does not exist.
//This can cause an "undefined array key" warning.

//Solution:
//Use isset() to check whether the user ID exists before accessing it.
//If the ID exists, return the user's name.
//If it does not exist, return "User not found".


function getUser($id) {

    $users = [
        1 => 'Ali',
        2 => 'Ahmed',
        3 => 'Usman'
    ];

    if (isset($users[$id])) {
        return $users[$id];
    }

    return "User not found";
}

echo getUser(5);

?>