const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')
const tabletojson = require('tabletojson').Tabletojson

var outputData = []

const url = 'https://bluearchive.fandom.com/wiki/Student/Detailed_List'
request(url, (err, res, data) => {
    if (err) { console.log(err); return }

    const filteredData = (data.split('<td colspan="13" style="Background: #02d3fb;color:#000000;font-size:12px;"><b>Detailed List</b>\n</td></tr>')[1]).split('</tbody></table>')[0]
    const charArray = filteredData.split('<tr>\n<td colspan="13" style="background: #02d3fb;">\n</td></tr>\n\n\n')
    
    let promises = []
    charArray.forEach(item => {
        promises.push(new Promise(resolve => {
            let $ = cheerio.load(`<table>${item}</table>`)
            let icon_el = $('div[style="z-index: 1;"]').children('a')
            let tableData = tabletojson.convert(`<table>${item}</table>`)[0]

            let charData = {
                'name': icon_el.attr('title'),
                'wiki': `https://bluearchive.fandom.com${icon_el.attr('href')}`,
                'icon': (icon_el.children('img').data('src') || icon_el.children('img').attr('src')).split('/revision/')[0],
                'rank': tableData[0][1],
                'damage': tableData[0][5],
                'armor': tableData[2][5],
                'type': tableData[1][1],
                'role': tableData[2][1],
                'position': tableData[3][1],
                'city': $($('td[rowspan="2"]')[7]).children().attr('href').split('/revision/')[0],
                'desert': $($('td[rowspan="2"]')[8]).children().attr('href').split('/revision/')[0],
                'indoor': $($('td[rowspan="2"]')[9]).children().attr('href').split('/revision/')[0],
                'hp': tableData[2][6],
                'atk': tableData[2][7],
                'def': tableData[2][8],
                'hl': tableData[2][9],
                'mhp': tableData[3][2],
                'matk': tableData[3][7],
                'mdef': tableData[3][8],
                'mhl': tableData[3][9],
                'item1': $($('td[rowspan="2"]')[4]).children().attr('href').split('/revision/')[0],
                'item2': $($('td[rowspan="2"]')[5]).children().attr('href').split('/revision/')[0],
                'item3': $($('td[rowspan="2"]')[6]).children().attr('href').split('/revision/')[0],
                'cover': $($('td[rowspan="2"]')[11]).children().attr('href').split('/revision/')[0],
                'weapon': $($('td[rowspan="2"]')[12]).children().attr('href').split('/revision/')[0]
            }

            outputData.push(charData)
            resolve()
        }))
    })

    Promise.all(promises).then(() => {
        console.log(outputData[2])
    })
})