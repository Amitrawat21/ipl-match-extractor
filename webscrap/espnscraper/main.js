const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

const request = require('request')
const cheerio = require('cheerio') 
 

const allMatchObj = require('./allmatch')  
const path = require ('path')
 
const fs = require('fs') 
let iplPath = path.join(__dirname, "IPL")  
 
console.log(__dirname)

dirCreator(iplPath)




request(url, cb)


function cb(error, response, html) {
       if (error) {
              console.log(error)
       }
       else {
              extractLink(html)
       }
}


function extractLink(html) {
       let $ = cheerio.load(html)

       let anchorElem = $('a[data-hover="View All Results"]')

       let link = anchorElem.attr('href')


       let fullLink = 'https://www.espncricinfo.com' + link

       console.log(fullLink)


       allMatchObj.getAllMatch(fullLink)

} 
function dirCreator(filepath){ 
       if(fs.existsSync(filepath)== false){ 
              fs.mkdirSync(filepath)

       }

}

