const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')

const url = 'https://bluearchive.fandom.com/wiki/Student/Detailed_List'
request(url, (err, res, data) => {
    if (err) { console.log(err); return }

    const filteredData = (data.split('<td colspan="13" style="Background: #02d3fb;color:#000000;font-size:12px;"><b>Detailed List</b>\n</td></tr>')[1]).split('</tbody></table>')[0]
    const charArray = filteredData.split('<td colspan="13" style="background: #02d3fb;">\n</td></tr>\n\n\n')
    
    charArray.forEach(item => {
        let $ = cheerio.load(item)

        let img = $('div[style="z-index: 1;"]').children('a').children('img')
        console.log((img.data('src') || img.attr('src')).split('/revision/')[0])
    })
})