// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

function handleMessage(sender_psid, received_message) {
	let response;

	// Check if the message contains text
	if (received_message.text) {
		// Create the payload for a basic text message
		response = {
			text: `You sent the message: "${received_message.text}". Now send me an image!`,
		};
	}

	// Sends the response message
	callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
	// Construct the message body
	let request_body = {
		recipient: {
			id: sender_psid,
		},
		message: response,
	};

	// Send the HTTP request to the Messenger Platform
	request(
		{
			uri: "https://graph.facebook.com/v2.6/me/messages",
			qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
			method: "POST",
			json: request_body,
		},
		(err, res, body) => {
			if (!err) {
				console.log("message sent!");
			} else {
				console.error("Unable to send message:" + err);
			}
		}
	);
}

export default function handler(req, res) {
	if (req.method === "POST") {
		let body = req.body;

		// Check the webhook event is from a Page subscription
		if (body.object === "page") {
			// Iterate over each entry - there may be multiple if batched
			body.entry.forEach(function (entry) {
				// Get the webhook event. entry.messaging is an array, but
				// will only ever contain one event, so we get index 0
				let webhook_event = entry.messaging[0];

				let sender_psid = webhook_event.sender.id;

				handleMessage(sender_psid, webhook_event.message);
			});

			// Return a '200 OK' response to all events
			res.status(200).send("EVENT_RECEIVED");
		} else {
			// Return a '404 Not Found' if event is not from a page subscription
			res.sendStatus(404);
		}
	}

	if (req.method === "GET") {
		const VERIFY_TOKEN = "testing12345";
		// Parse params from the webhook verification request
		let mode = req.query["hub.mode"];
		let token = req.query["hub.verify_token"];
		let challenge = req.query["hub.challenge"];

		// Check if a token and mode were sent
		if (mode && token) {
			// Check the mode and token sent are correct
			if (mode === "subscribe" && token === VERIFY_TOKEN) {
				// Respond with 200 OK and challenge token from the request
				console.log("VERIFIED");
				res.status(200).send(req.query["hub.challenge"]);
			} else {
				// Responds with '403 Forbidden' if verify tokens do not match
				res.sendStatus(403);
			}
		}
	}
}
