const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')

var outputData = []

const domainUrl = 'https://bluearchive.fandom.com'
const suffixUrl = '/wiki/Category:Students'
request(domainUrl + suffixUrl, (err, res, listRawData) => {
	if (err) {console.log(err); return}

	let promises = []

	let list$ = cheerio.load(listRawData)
	list$(list$('tbody')[2]).find('a[title]').each((index, el) => {

		promises.push(new Promise(resolve => {

		    let charUrl = list$(el).attr('href')
		    request(domainUrl + charUrl, (err, res, charRawData) => {
		    	if (err) {console.log(err); return}

		    	let $ = cheerio.load(charRawData)

		    	let getData = (section, row) => {
		    		return $('aside.portable-infobox').children('section').eq(section).children('div').eq(row).children('div')
		    	}

		    	let charData = {
		    		'profile': {
		    			'nameEn': $('aside.portable-infobox').children('h2').text().split('/')[0],
			    		'nameJp': $('aside.portable-infobox').children('h2').text().split('/')[1],
			    		'age': getData(9, 0).text(),
			    		'birthday': getData(9, 1).text(),
			    		'height': getData(9, 2).text(),
			    		'year': getData(9, 3).text(),
			    		'club': getData(9, 4).text(),
			    		'hobby': getData(9, 5).html().replace(/<ul>|<li>/g, '').replace('</ul>', '').split('</li>').slice(0, -1) == '' ? [getData(9, 5).text()] : getData(9, 5).html().replace(/<ul>|<li>/g, '').replace('</ul>', '').split('</li>').slice(0, -1)
		    		},
		    		'gallery': {
		    			//$('div:contains("Portrait"):not(:has(*))').prev().find('img').data('src')
		    		}

		    	}

		    	outputData.push(charData)
		    	resolve()
		    })
		}))
	})

	Promise.all(promises).then(() => {
        console.log(outputData[1])
        console.log(outputData[2])
        console.log(outputData[3])
    })
})

