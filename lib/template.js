module.exports = {
	HTML: function (title, list, body, control) {
		return `
			<!doctype html>
			<html>

			<head>
				<title>${title}</title>
				<meta charset="utf-8">
			</head>

			<body>
				<h1><a href="/">WEB</a></h1>
				<ul>
					${list}
				</ul>
				${control}
				${body}
			</body>
			
			</html>
    	`;
	},
	
	list: function (filelist) {
		let list = '';
		for (let file of filelist) {
			list += `<li><a href="/page/${file}">${file}</a></li>`;
		}
		
		return list;
	}
}
