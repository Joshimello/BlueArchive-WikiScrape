const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')

charGallery = {}

promises = []
const charData = JSON.parse(fs.readFileSync('data.json', 'utf8'))
//const charData = {'Izayoi Nonomi': {'wiki': 'https://bluearchive.fandom.com/wiki/Izayoi_Nonomi'}}
for (let key in charData) {

	charGallery[key] = {}
	promises.push(new Promise(resolve => {

		request(`${charData[key].wiki}/Gallery`, (err, res, data) => {

			let $ = cheerio.load(data)
			$('.wikia-gallery-item').children('.lightbox-caption').each((index, el) => {
				if ($(el).prev('.thumb').find('img').data('src') == undefined) {
					charGallery[key][$(el).text()] = "NoImage"
				} 

				else {
					charGallery[key][$(el).text()] = $(el).prev('.thumb').find('img').data('src').split('/revision/')[0]
				}
			})

			resolve()
		})
	}))
}

Promise.all(promises).then(() => {
	fs.writeFile('gallery.json', JSON.stringify(charGallery, null, 4), () => {
        console.log('Completed! Data written to gallery.json')
    })
})