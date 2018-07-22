const express = require('express');
const app = express();
const configData = require('./config.json');

app.get('/foo', (req, res) => {
			var authHdr = req.headers.authorization;
			var testStr= 'aClient:' + configData.secret;
			console.log(req.headers);
			if(authHdr && authHdr === testStr) {
				console.log("got a request");
				res.send('Hello World!');
			} else {
				res.status(403).end();
			}
		}
);

app.use(express.static('../public'));

app.listen(3000, () => console.log('Example app listening package.jsonon port 3000!'));