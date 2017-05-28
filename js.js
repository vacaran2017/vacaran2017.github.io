let other = {
	ja: 'en',
	en: 'ja',
}

function createToc() {
	let toc = {
		ja: ['<nav><h2>目録</h2><ul>', '</ul></nav>'],
		en: ['<nav><h2>Contents</h2><ul>', '</ul></nav>'],
	}

	// for each <section>
	$('section').each(function(index) {
		let lang = $(this).attr('lang');

		// build the toc <li> elements from each header
		$(this).find('h1, h2, h3, h4, h5, h6').each(function(index) {
			let tagName = $(this).prop('tagName');
			let headerLevel = tagName.substr(1,1) // save the header level for the CSS class later
			let id = 'header-' + index + '-' + lang;
			let headerText = $(this).text();

			// add id to header
			$(this).attr('id', id);

			console.log(headerLevel, headerText);

			// create <li> and insert into toc array
			// I considered making nested HTML lists which would be more "proper", but it sounds complicated
			// so screw it, nesting is emulated using CSS
			let element = '<li><a class="toc__level--' + headerLevel + '" href="#' + id + '">' + headerText + '</a></li>';
			toc[lang].splice(1 + index, 0, element);
		});

		// convert the toc array to a string and insert it into the beginning of the <section>
		$(this).prepend(toc[lang].join(''));

		// add numbers to each <p>
		$(this).find('p').each(function(index) {
			let number = index + 1;

			let id = lang + '-' + number;
			let href = '#' + other[lang] + '-' + number; // make the number a link to the corresponding paragraph in the other column
			$(this).prepend('<a class="p__number" id="' + id + '" href="' + href + '">' + number + '</a>');
		});
	});
}

function paragraphHighlight() {
	// on mouse over a paragraph
	$('p').mouseover(function() {
		$('.p--target').removeClass('p--target'); // unhighlight any highlighted paragraphs

		let thisId = '#' + $(this).children('.p__number').attr('id');
		$(thisId).parent().addClass('p--target'); // add highlight to the parent <p> of the number

		let otherId = thisId.replace(/(en|ja)/, function(match, lang, offset, string) { return other[lang]; });
		$(otherId).parent().addClass('p--target'); // add highlight to the corresponding <p> in the other column too
	});
}

$(document).ready(function() {
	createToc();
	paragraphHighlight();
});