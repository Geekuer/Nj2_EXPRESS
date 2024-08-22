const express = require('express');
const app = express();
const topic = require('./lib/topic');

app.get('/', (request, response) => {
	topic.home(request, response);
});

app.get('/page/:pageTitle', (request, response, next) => {
	topic.page(request, response, next);
});

app.get('/create', (request, response) => {
	topic.create(request, response);
});

app.post('/create_process', (request, response) => {
	topic.create_process(request, response);
});

app.get('/update/:updateTitle', (request, response) => {
	topic.update(request, response);
});

app.post('/update_process', (request, response) => {
	topic.update_process(request, response);
});

app.post('/delete_process', (request, response) => {
	topic.delete_process(request, response);
});

app.use((request, response) => {
	response.status(404).send('Not Found');
});

app.use((error, request, response, next) => {
	response.status(404).send('Not Found')
});

PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});	