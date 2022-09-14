const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')

var outputData = {}

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

		    	let charData = {
		    		'wiki': domainUrl + charUrl,
		    		'profile': {
		    			'nameEn': $('aside.portable-infobox').children('h2').text().split('/')[0].replace(/\s$/, ''),
			    		'nameJp': $('aside.portable-infobox').children('h2').text().split('/')[1].replace(/^\s/, ''),
			    		'age': $('aside.portable-infobox').children('section').eq(9).children('div').eq(0).children('div').text(),
			    		'birthday': $('aside.portable-infobox').children('section').eq(9).children('div').eq(1).children('div').text(),
			    		'height': $('aside.portable-infobox').children('section').eq(9).children('div').eq(2).children('div').text(),
			    		'year': $('aside.portable-infobox').children('section').eq(9).children('div').eq(3).children('div').text(),
			    		'club': $('aside.portable-infobox').children('section').eq(9).children('div').eq(4).children('div').text(),
			    		'hobby': $('aside.portable-infobox').children('section').eq(9).children('div').eq(5).children('div').find('li').toArray().map((i) => {return $(i).text()}) == '' ? [$('aside.portable-infobox').children('section').eq(9).children('div').eq(5).children('div').text()] : $('aside.portable-infobox').children('section').eq(9).children('div').eq(5).children('div').find('li').toArray().map((i) => {return $(i).text()})
		    		},
		    		'info': {
		    			'rarity': $('td[data-source="rarity"]').children('a').length,
		    			'bond': $('td[data-source="bond"]').children().last().text().split(' ')[2],
		    			'cover': $('td[data-source="cover"]').children().last().text() == 'Cover' ? true : false,
		    			'role': $('td[data-source="role"]').children().last().text().toLowerCase(),
		    			'class': $('td[data-source="class"]').children().last().text().toLowerCase(),
		    			'position': $('td[data-source="position"]').children().last().text().toLowerCase(),
		    			'school': $('td[data-source="school"]').children().attr('title') == undefined ? 'none' : $('td[data-source="school"]').children().attr('title').toLowerCase(),
		    			'firearm': $('td[data-source="firearm"]').children().attr('title').replace('Firearm#', '').toLowerCase(),
		    			'city': $('td[data-source="city2"]').find('img').data('image-name').split(' ')[0].toLowerCase(),
		    			'desert': $('td[data-source="desert2"]').find('img').data('image-name').split(' ')[0].toLowerCase(),
		    			'indoor': $('td[data-source="indoor2"]').find('img').data('image-name').split(' ')[0].toLowerCase(),
		    			'offensive': $('td[data-source="offensive"]').find('b').text().toLowerCase(),
		    			'defensive': $('td[data-source="defensive"]').find('b').text().toLowerCase(),
		    			'equipment': $('td[data-source^="equipment"] a').toArray().map((i) => {return $(i).attr('title').replace('Equipment#', '')})
		    		},
		    		'stats': {
		    			'level1': {
		    				'hp': $('td[data-source="hp1"]').text(),
		    				'atk': $('td[data-source="atk1"]').text(),
		    				'def': $('td[data-source="def1"]').text(),
		    				'heal': $('td[data-source="heal1"]').text()
		    			},
		    			'level100': {
		    				'hp': $('td[data-source="hp100"]').text(),
		    				'atk': $('td[data-source="atk100"]').text(),
		    				'def': $('td[data-source="def100"]').text(),
		    				'heal': $('td[data-source="heal100"]').text()
		    			},
		    			'star2': {
		    				'hp': $('td[data-source="hp2"]').text(),
		    				'atk': $('td[data-source="atk2"]').text(),
		    				'def': $('td[data-source="def2"]').text(),
		    				'heal': $('td[data-source="heal2"]').text()
		    			},
		    			'star3': {
		    				'hp': $('td[data-source="hp3"]').text(),
		    				'atk': $('td[data-source="atk3"]').text(),
		    				'def': $('td[data-source="def3"]').text(),
		    				'heal': $('td[data-source="heal3"]').text()
		    			},
		    			'star4': {
		    				'hp': $('td[data-source="hp4"]').text(),
		    				'atk': $('td[data-source="atk4"]').text(),
		    				'def': $('td[data-source="def4"]').text(),
		    				'heal': $('td[data-source="heal4"]').text()
		    			},
		    			'star5': {
		    				'hp': $('td[data-source="hp5"]').text(),
		    				'atk': $('td[data-source="atk5"]').text(),
		    				'def': $('td[data-source="def5"]').text(),
		    				'heal': $('td[data-source="heal5"]').text()
		    			},
		    			'other': {
		    				'acc': $('td[data-source="acc"]').text(),
		    				'eva': $('td[data-source="eva"]').text(),
		    				'cr': $('td[data-source="cr"]').text(),
		    				'cd': $('td[data-source="cd"]').text(),
		    				'stable': $('td[data-source="stable"]').text(),
		    				'range': $('td[data-source="range"]').text(),
		    				'ccp': $('td[data-source="ccp"]').text(),
		    				'ccr': $('td[data-source="ccr"]').text()
		    			}
		    		},
		    		'skills': {
		    			'ex': {
		    				'name': $('.wds-tabber:contains("Cost")').children('.wds-tab__content').eq(0).find('th').eq(0).text().replace(/V • T • E |\n/g, '').split(/ Cost:| Skill Icons/)[0],
		    				'icon': $('.wds-tabber:contains("Cost")').children('.wds-tab__content').eq(0).find('th').eq(1).find('img').data('src').split('/revision/')[0],
		    				'levelbase': $('.wds-tabber:contains("Cost")').children('.wds-tab__content').eq(0).find('td').find('li').first().text().split(' ~ ')[1],
		    				'levelmax': $('.wds-tabber:contains("Cost")').children('.wds-tab__content').eq(0).find('td').find('li').last().text().split(' ~ ')[1],
		    				'cost': $('.wds-tabber:contains("Cost")').children('.wds-tab__content').eq(0).find('th').eq(0).text().replace(/V • T • E |\n/g, '').split(/ Cost:| Skill Icons/)[1]
		    			},
		    			'normal': {
		    				'name': $('.wds-tabber:contains("Cost")').children('.wds-tab__content').eq(1).find('th').eq(0).text().replace(/V • T • E |\n/g, '').split(/ Cost:| Skill Icons/)[0],
		    				'icon': $('.wds-tabber:contains("Cost")').children('.wds-tab__content').eq(1).find('th').eq(1).find('img').data('src').split('/revision/')[0],
		    				'levelbase': $('.wds-tabber:contains("Cost")').children('.wds-tab__content').eq(1).find('td').find('li').first().text().split(' ~ ')[1],
		    				'levelmax': $('.wds-tabber:contains("Cost")').children('.wds-tab__content').eq(1).find('td').find('li').last().text().split(' ~ ')[1]
		    			},
		    			'passive': {
		    				'name': $('.wds-tabber:contains("Cost")').children('.wds-tab__content').eq(2).find('th').eq(0).text().replace(/V • T • E |\n/g, '').split(/ Cost:| Skill Icons/)[0],
		    				'icon': $('.wds-tabber:contains("Cost")').children('.wds-tab__content').eq(2).find('th').eq(1).find('img').data('src').split('/revision/')[0],
		    				'levelbase': $('.wds-tabber:contains("Cost")').children('.wds-tab__content').eq(2).find('td').find('li').first().text().split(' ~ ')[1],
		    				'levelmax': $('.wds-tabber:contains("Cost")').children('.wds-tab__content').eq(2).find('td').find('li').last().text().split(' ~ ')[1]
		    			},
		    			'sub': {
		    				'name': $('.wds-tabber:contains("Cost")').children('.wds-tab__content').eq(3).find('th').eq(0).text().replace(/V • T • E |\n/g, '').split(/ Cost:| Skill Icons/)[0],
		    				'icon': $('.wds-tabber:contains("Cost")').children('.wds-tab__content').eq(3).find('th').eq(1).find('img').data('src').split('/revision/')[0],
		    				'levelbase': $('.wds-tabber:contains("Cost")').children('.wds-tab__content').eq(3).find('td').find('li').first().text().split(' ~ ')[1],
		    				'levelmax': $('.wds-tabber:contains("Cost")').children('.wds-tab__content').eq(3).find('td').find('li').last().text().split(' ~ ')[1]
		    			}
		    		}
		    	}

		    	outputData[$('aside.portable-infobox').children('h2').text().split('/')[0].replace(/\s$/, '')] = charData
		    	resolve()
		    })
		}))
	})

	Promise.all(promises).then(() => {

		promisess = []
		for (let key in outputData) {

			outputData[key].gallery = {}
			promisess.push(new Promise(resolve => {

				request(`${outputData[key].wiki}/Gallery`, (err, res, data) => {

					let $ = cheerio.load(data)
					$('.wikia-gallery-item').children('.lightbox-caption').each((index, el) => {
						if ($(el).prev('.thumb').find('img').data('src') == undefined) {
							outputData[key].gallery[$(el).text()] = "NoImage"
						} 

						else {
							outputData[key].gallery[$(el).text()] = $(el).prev('.thumb').find('img').data('src').split('/revision/')[0]
						}
					})

					resolve()
				})
			}))
		}

		Promise.all(promisess).then(() => {
			fs.writeFile('data.json', JSON.stringify(outputData, null, 4), () => {
	            console.log('Completed! Data written to data.json')
	        })
		})
	})
})

