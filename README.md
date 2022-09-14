# bluearchive-wiki-scrape
Currently, scrapes the [Blue Archive Fandom](https://bluearchive.fandom.com/wiki/Student/Detailed_List) detailed list for each playable character data, and outputs as json format.

## Usage
Just copy the [data.json](https://github.com/Joshimello/bluearchive-wiki-scrape/blob/main/data.json) file to your project and use it however you want.

Example usage:
```javascript
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'))
console.log(data[Takanashi Hoshino (Swimsuit ver.)].profile.hobby)
// ["Afternoon Nap", "Rumbling"]
```

## Dependencies
**Backend**
- [node.js](https://github.com/nodejs/node): Main runtime.
- [fs](https://github.com/nodejs/node/blob/main/doc/api/fs.md): Save data to file.
- [request](https://github.com/request/request): Request html from wiki site.
- [cheerio](https://github.com/cheeriojs/cheerio): Parse html.

## To-Do
- nothing so far

## Contribute
Always welcomed to improve anything or add suggestions! 
Of course reading this already makes me happy enough uwu~
