<?php
// Helper functie om student_id naar naam te mappen (voor demo)
function getStudentName($id) {
    
    return $students[$id] ?? 'Onbekend';
}
