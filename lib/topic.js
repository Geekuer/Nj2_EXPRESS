const fs = require('fs');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const template = require('./template');
const qs = require('querystring');

module.exports = {
	home: function (request, response) {
		fs.readdir('./data', function (error, filelist) {
			const title = 'Welcome';
			const description = 'Hello, Node.js';
			const list = template.list(filelist);
			const html = template.HTML(title, list,
				`<h2>${title}</h2>${description}`,
				`<a href="/create">Create</a>`
			);
	
			response.send(html);
		});
	},

	page: function (request, response, next) {
		fs.readdir('./data', function (error, filelist) {
			const filteredTitle = path.parse(request.params.pageTitle).base;

			fs.readFile(`data/${filteredTitle}`, 'utf8', function (error2, description) {
				if (error2) {
					next(error2);
					
				} else {
					const title = request.params.pageTitle;
					const sanitizedTitle = sanitizeHtml(title);
		
					const sanitizedDescription = sanitizeHtml(description);
		
					const list = template.list(filelist);
					const html = template.HTML(sanitizedTitle, list,
						`<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
						` <a href="/create">Create</a>
						<a href="/update/${sanitizedTitle}">Update</a>
						<form action="/delete_process" method="post" onsubmit="return confirm('Are you sure you want to delete this item?')">
							<input type="hidden" name="title" value="${sanitizedTitle}">
							<input type="submit" value="Delete">
						</form>`
					);
		
					response.send(html);
				}
			});
		});
	},

	create: function (request, response) {
		fs.readdir('./data', function (error, filelist) {
			const title = 'Create';
			const list = template.list(filelist);
			const html = template.HTML(title, list, 
				`<h2>${title}</h2>
				<form action="/create_process" method="post">
					<p>
						<input type="text" name="title" placeholder="title" required>
					</p>
					<p>
						<textarea name="description" placeholder="description"></textarea>
					</p>
					<p>
						<input type="submit">
					</p>
				</form>`,
				'');
				
			response.send(html);
		});
	},

	create_process: function (request, response) {
		let body = '';
		request.on('data', function (data) {
			body += data;
		});

		request.on('end', function () {
			const { title, description } = qs.parse(body);
			const filteredTitle = path.parse(title).base;

			fs.writeFile(`data/${filteredTitle}`, description, 'utf8', function (error) {
				response.redirect(`/page/${filteredTitle}`);
				console.log(`Created : ${filteredTitle}`);
			})
		});
	},

	update: function (request, response) {
		fs.readdir('./data', function (error, filelist) {
			const filteredTitle = path.parse(request.params.updateTitle).base;
	
			fs.readFile(`data/${filteredTitle}`, 'utf8', function (error2, description) {
				const title = request.params.updateTitle;
				const list = template.list(filelist);
				const html = template.HTML(`Update ${title}`, list,
					`<h2>Update ${title}</h2>
					<form action="/update_process" method="post">
						<input type="hidden" name="old_title" value="${title}">
						<p><input type="text" name="title" placeholder="title" required value="${title}"></p>
						<p><textarea name="description" placeholder="description">${description}</textarea></p>
						<p><input type="submit"></p>
					</form>`,
				'');
	
				response.send(html);
			});
		});
	},

	update_process: function (request, response) {
		let body = '';
		request.on('data', function (data) {
			body += data;
		});

		request.on('end', function () {
			const { old_title, title, description } = qs.parse(body);
			const filteredOld_title = path.parse(old_title).base;
			const filteredTitle = path.parse(title).base;

			fs.rename(`data/${filteredOld_title}`, `data/${filteredTitle}`, function (error) {
				fs.writeFile(`data/${filteredTitle}`, description, 'utf8', function (error2) {
					response.redirect(`/page/${filteredTitle}`);
					console.log(`Updated : ${filteredOld_title} -> ${filteredTitle}`);
				})
			});
		});
	},

	delete_process: function (request, response) {
		let body = '';
		request.on('data', function (data) {
			body += data;
		});

		request.on('end', function () {
			const { title } = qs.parse(body);
			const filteredTitle = path.parse(title).base;

			fs.unlink(`data/${filteredTitle}`, function (error) {
				response.redirect('/');
			})
		});
	}
}