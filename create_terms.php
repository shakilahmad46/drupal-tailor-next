<?php

use Drupal\taxonomy\Entity\Term;

// Create taxonomy terms
$terms = [
    'Shalwar Qameez' => 'Traditional Pakistani outfit consisting of Qameez (shirt) and Shalwar (loose trousers)',
    'Shirt' => 'Formal or casual shirt',
    'Coat' => 'Formal coat or blazer',
    'Waistcoat' => 'Sleeveless garment worn over shirt'
];

foreach ($terms as $name => $description) {
    $term = Term::create([
        'vid' => 'measurement_type',
        'name' => $name,
        'description' => [
            'value' => $description,
            'format' => 'basic_html',
        ],
    ]);
    $term->save();
    echo "Created term: $name\n";
}

echo "All taxonomy terms created successfully!\n";
