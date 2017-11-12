'use strict';

var otherLang = {
	ja: 'en',
	en: 'ja',
}

function createToc() {
	var toc = {
		ja: ['<nav><h2>目録</h2><ul>', '</ul></nav>'],
		en: ['<nav><h2>Contents</h2><ul>', '</ul></nav>'],
	}

	// for each <section>
	var sections = document.getElementsByTagName('section');

	for (var i = 0; i < sections.length; i++) {
		var lang = sections[i].getAttribute('lang');

		// build the toc <li> elements from each header
		var headers = sections[i].querySelectorAll('h1, h2, h3, h4, h5, h6');

		for (var j = 0; j < headers.length; j++) {
			var tagName = headers[j].tagName;
			var headerLevel = tagName.substr(1,1) // save the header level for the CSS class later
			var id = 'header-' + j + '-' + lang;
			var headerText = headers[j].innerHTML;

			// add id to header
			headers[j].setAttribute('id', id);

			console.log(headerLevel, headerText);

			// create <li> and insert into toc array
			// I considered making nested HTML lists which would be more "proper", but it sounds complicated
			// so screw it, nesting is emulated using CSS
			var sectionListItem = '<li><a class="toc__level--' + headerLevel + '" href="#' + id + '">' + headerText + '</a></li>';
			toc[lang].splice(1 + j, 0, sectionListItem);
		}

		// convert the toc array to a string and insert it into the beginning of the <section>
		sections[i].innerHTML = toc[lang].join('') + sections[i].innerHTML;

		// add numbers to each <p>
		var paragraphs = sections[i].getElementsByTagName('p');

		for (var j = 0; j < paragraphs.length; j++) {
			var number = j + 1;

			var id = lang + '-' + number;
			var href = '#' + otherLang[lang] + '-' + number; // make the number a link to the corresponding paragraph in the other column
			var paragraphNumberA = '<a class="p__number" id="' + id + '" href="' + href + '">' + number + '</a>';
			paragraphs[j].innerHTML = paragraphNumberA + paragraphs[j].innerHTML;
		}
	}
}

function paragraphHighlight() {
	var paragraphs = document.getElementsByTagName('p')

	for (var i = 0; i < paragraphs.length; i++) {
		// on mouse over a paragraph
		paragraphs[i].addEventListener(
			'mouseover',
			function(event) {
				var pTargets = Array.prototype.slice.call(document.getElementsByClassName('p--target'), 0);

				for (var j = 0; j < pTargets.length; j++) {
					pTargets[j].classList.remove('p--target'); // unhighlight any highlighted paragraphs
				}

				var presentID = this.getElementsByClassName('p__number')[0].id;
				this.classList.add('p--target'); // add highlight to the present paragraph

				var presentLang = presentID.substring(0, 2);
				var sisterId = otherLang[presentLang] + presentID.substring(2, presentID.length);
				document.getElementById(sisterId).parentNode.classList.add('p--target'); // add highlight to the corresponding <p> in the other column too
			},
			false
		);
	}
}

function main() {
	createToc();
	paragraphHighlight();
}

window.onload = function() {
	main();
}