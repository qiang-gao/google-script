<?php
require './vendor/autoload.php';
define('APPLICATION_NAME', 'Google Apps Script Execution API PHP Quickstart');
define('CREDENTIALS_PATH', './script-php-quickstart.json');
define('CLIENT_SECRET_PATH', './client_secret.json');
define('SCOPES', implode(' ', ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/forms",]));


function getClient()
{
    $client = new Google_Client();
    $client->setApplicationName(APPLICATION_NAME);
    $client->setScopes(SCOPES);
    $client->setAuthConfig(CLIENT_SECRET_PATH);
    $client->setAccessType('offline');

    // Load previously authorized credentials from a file.
    $credentialsPath = expandHomeDirectory(CREDENTIALS_PATH);

    if (file_exists($credentialsPath)) {
        $accessToken = json_decode(file_get_contents($credentialsPath), true);
    } else {
        // Request authorization from the user.
        $authUrl = $client->createAuthUrl();
        printf("Open the following link in your browser:\n%s\n", $authUrl);
        print 'Enter verification code: ';
        $authCode = trim(fgets(STDIN));

        // Exchange authorization code for an access token.
        $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);

        // Store the credentials to disk.
        if (!file_exists(dirname($credentialsPath))) {
            mkdir(dirname($credentialsPath), 0700, true);
        }
        file_put_contents($credentialsPath, json_encode($accessToken));
        printf("Credentials saved to %s\n", $credentialsPath);
    }
    $client->setAccessToken($accessToken);

    // Refresh the token if it's expired.
    if ($client->isAccessTokenExpired()) {
        $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
        file_put_contents($credentialsPath, json_encode($client->getAccessToken()));
    }
    return $client;
}


function expandHomeDirectory($path) {
    $homeDirectory = getenv('HOME');
    if (empty($homeDirectory)) {
        $homeDirectory = getenv('HOMEDRIVE') . getenv('HOMEPATH');
    }
    return str_replace('~', realpath($homeDirectory), $path);
}

$client = getClient();
$service = new Google_Service_Script($client);

$scriptId = '1oYNMf7h1ZnWhrIRUpykceHO37TpHiwpoJq4LdZdSAMKeF8S_nbR7sUEj';
// Create an execution request object.
$request = new Google_Service_Script_ExecutionRequest();

$data = [
    'form_name' => "test 11",
    'property_id' => "113",
    'properties_live_id' => "113",
];
$request->setFunction('create_form_builder');
$request->setParameters($data);

try {
    // Make the API request. run script
    $response = $service->scripts->run($scriptId, $request);
    if ($response->getError()) {
        $error = $response->getError()['details'][0];
        $res = "Script error message: \n" . $error['errorMessage'];
    } else {
        $resp = $response->getResponse();
        $res = $resp['result'];
    }
} catch (Exception $e) {
    $res = 'Caugth exception: ' .$e->getMessage() . "\n";
}

var_dump($res);