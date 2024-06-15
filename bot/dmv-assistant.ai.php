<?php
//header('Content-type: text/html; charset=utf-8');
header('Content-type: application/json; charset=utf-8');
setlocale(LC_ALL, 'en_US.utf8');


$dir = dirname(__FILE__);
(include $dir.'/at.config.php') || die('{"error":"Service temporarily unavailable."}');
(include $dir.'/at.global_functions.php') || die('{"error":"Service temporarily unavailable."}');

$isAdmin = wp_validate_auth_cookie();

if (isset($_SERVER["HTTP_ORIGIN"]) === true) {
	$origin = $_SERVER["HTTP_ORIGIN"];
	$allowedOrigins = array(
		'http://'.(PSUBDOMAIN ? PSUBDOMAIN.'.' : '').PDOMAIN,
		'https://'.(PSUBDOMAIN ? PSUBDOMAIN.'.' : '').PDOMAIN,
		'http://'.(PSUBDOMAIN ? PSUBDOMAIN.'.' : '').PDOMAIN.':80',
		'https://'.(PSUBDOMAIN ? PSUBDOMAIN.'.' : '').PDOMAIN.':443'
	);
	if (in_array($origin, $allowedOrigins, true) === true) {
		header('Access-Control-Allow-Origin: '.$origin);
		header('Access-Control-Allow-Credentials: true'); // xhr.withCredentials = true;
		header('Access-Control-Allow-Methods: POST, GET');
		header('Access-Control-Allow-Headers: Content-Type, Accept, X-Requested-With'); // xhr.setRequestHeader('Accept', 'application/json');
	}
	if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
		exit;
	}
}

$dbId = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME) or die('{"error":"DB Error: Could not connect."}'); // mysqli_connect_errno() | mysqli_connect_error()
mysqli_query($dbId, '/'."*!40101 SET NAMES '".COLLATE."' *".'/');

$body = json_decode(file_get_contents('php://input'), true);

if(!empty($body['msg'])){

	$chat_messages = $body['msg'];

	require_once $dir."/open-ai/Url.php";
	require_once $dir."/open-ai/OpenAi_v3.php";

	$firstName = '';
	if(!empty(WP_UID)){
		$metas = get_user_meta(WP_UID);
		$firstName = !empty($metas['first_name']) ? trim($metas['first_name']) : '';
	}

	$messages = [];

	$systemMsg = <<<HTML
As a friendly assistant for Driving-Tests.org users, your role is to guide the user through the process of obtaining, renewing or upgrading a driving license in their US state.
Adopt an informal yet helpful tone. Use the user's name occasionally for a more personal touch. Show empathy and affirmation in your responses. Acknowledge the user’s emotions if they express frustration or anxiety, and reassure them. Use phrases that show understanding and encouragement. If you can't provide an answer or the requested help, admit this humbly and empathetically. In case the user needs help with something not related to driver licensing, but still related to the Driving-Tests.org website (e.g. their account, billing, their progress, passing probability, etc), please route them to the customer support chat; the “Support Chat” link is located in top navigation menu in the “Help” dropdown menu on desktop. They can also get support via email (info@driving-tests.org).
Remember to use emojis thoughtfully and creatively where appropriate, to add warmth and expressiveness to your responses. Be encouraging and motivational, and praise the user's efforts.
First ask the user for their state and then category of license they are trying to obtain (regular car license, commercial driving license or motorcycle license), then explain the process step by step, drawing on the official web resources of the motor vehicle authority for that state.
HTML;
	if($firstName) $systemMsg .= <<<HTML
Use this name to address the user: {$firstName}
HTML;


	$messages[] = array(
		"role" => "system",
		"content" => $systemMsg
	);

	foreach($chat_messages as $chat_message){
		if(!empty($chat_message['role']) && !empty($chat_message['content'])){
			$messages[] = array(
				"role" => $chat_message['role'],
				"content" => $chat_message['content']
			);
		}
	}

	$gptResponse = '';

	try{
		$instance = new OpenAi(OPENAI_API_KEY);
		$res = $instance->chat([
			'model' => 'gpt-4o',
			'messages' => $messages,
			'temperature'	=> 0.7

		]);

		if(!empty($res)){
			$res = json_decode($res);
			if(!empty($res->choices)){
				$choice = $res->choices[0];
				if(!empty($choice->message->content)){
					$gpt_response = strval($choice->message->content);
					echo json_encode(array('response' => $gpt_response));
					exit;
				}	
			} elseif(!empty($res->error->message)){
				throw new Exception($res->error->message);
			}
		} throw new Exception('OPENAI_RESULT_EMPTY');
	}catch(Exception $e) {
		die('{"error":"'.$e->getMessage().'"}');
	}
}