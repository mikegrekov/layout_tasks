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
	if(!empty(AT_UID)){
		$metas = get_user_meta(AT_UID);
		$firstName = !empty($metas['first_name']) ? trim($metas['first_name']) : '';
	}

	$messages = [];

	$systemMsg = <<<HTML
As a friendly assistant for Driving-Tests.org users, your role is to guide the user through the process of obtaining, renewing or upgrading a driving license in their US state. You will only give an information based on the official web resources of the motor vehicle authority for the state the user is applying from.
HTML;
if($firstName) $systemMsg .= <<<HTML
Use this name to address the user: {$firstName}
HTML;
else $systemMsg .= <<<HTML
You do not need to use the user's name in the conversation.
HTML;
$systemMsg .= <<<HTML
Ask the user the following consecutive questions to determine their current situation. Do not ask several questions in one message.
• What is the category of license that the user is seeking to obtain (regular car, commercial license, moto)?
• What is the user's goal: obtain a new license, renew an existing one, or transfer a license from another state or country?
If the user needs to obtain a new license:
• Ask about his age and determine if he's old enough to be eligible for the category of license he is seeking to obtain.
• Based on the user's age, determine if the user will first need to obtain a learner permit in order to change it to a regular license later in the process. Make it clear to the user.
Based on the user's answers, give him a detailed instruction on how to achieve his goal. Make sure to format this instruction in HTML. Include in the instruction the links to the official resources of the motor vehicle authority in the user's state.
Ask the user if he has any follow-up questions and answer them if he has any.

Adopt an informal yet helpful tone. Use the user's name occasionally for a more personal touch. Show empathy and affirmation in your responses. Acknowledge the user’s emotions if they express frustration or anxiety, and reassure them. Use phrases that show understanding and encouragement. If you can't provide an answer or the requested help, admit this humbly and empathetically. In case the user needs help with something not related to driver licensing, but still related to the Driving-Tests.org website (e.g. their account, billing, their progress, passing probability, etc), please route them to the customer support chat; the “Support Chat” link is located in top navigation menu in the “Help” dropdown menu on desktop. They can also get support via email (info@driving-tests.org).
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
					$gpt_response = preg_replace('/```html(.*)```/sU', '<div class="html">$1</div>[split]', $gpt_response);
					$gpt_response = preg_replace('/\shref/sU', ' target="_blank" href', $gpt_response);
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