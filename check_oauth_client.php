<?php

use Drupal\consumer\Entity\Consumer;

// Check existing OAuth clients
$clients = \Drupal::entityTypeManager()->getStorage('consumer')->loadMultiple();
foreach ($clients as $client) {
  echo 'Client ID: ' . $client->getClientId() . PHP_EOL;
  echo 'Client Secret: ' . $client->get('secret')->value . PHP_EOL;
  echo 'Label: ' . $client->label() . PHP_EOL;
  echo '---' . PHP_EOL;
}

if (empty($clients)) {
  echo 'No OAuth clients found. Creating one...' . PHP_EOL;
  
  // Create OAuth client
  $client = Consumer::create([
    'label' => 'TailorPro Frontend',
    'client_id' => 'tailor-frontend',
    'client_secret' => 'tailor-secret-123',
    'grant_types' => ['password', 'refresh_token'],
    'scopes' => ['authenticated'],
    'is_default' => FALSE,
  ]);
  $client->save();
  
  echo 'OAuth client created successfully!' . PHP_EOL;
  echo 'Client ID: ' . $client->getClientId() . PHP_EOL;
  echo 'Client Secret: ' . $client->getSecret() . PHP_EOL;
}
