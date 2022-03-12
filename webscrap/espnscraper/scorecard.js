//const url = 'https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard' 
const request = require ('request') 
const cheerio  = require('cheerio')  
 
const path = require('path') 
const fs = require('fs') 
const xlsx = require("xlsx")
 
function processScoreCard(url){ 
 
request(url,cb) 
} 
 
 

 
function cb(error,response,html){ 
  if(error){
    console.log(error)
} 
else{
    extractMAthDetail(html)
}
 
} 
 

 
function extractMAthDetail(html){
  let $ = cheerio.load(html) 
   
  let descElem = $('.header-info .description')  
  let result = $(".match-info.match-info-MATCH.match-info-MATCH-half-width .status-text span").text();
  //console.log(descElem.text()) 
   
  let descarr  = descElem.text().split(',') 
  

  let venue = descarr[1].trim()  
  let date = descarr[2].trim() 
    
   
  
  console.log(venue) 
  console.log(date) 
  console.log(result)  
   
  let innings = $('.card.content-block.match-scorecard-table>.Collapsible')

  let htmlString = ''

  for(let i=0 ; i<innings.length ; i++){
         htmlString += $(innings[i]).html() 
          
         let teamName = $(innings[i]).find("h5").text();
         teamName = teamName.split("INNINGS")[0].trim();
     
         let opponentIndex = i == 0 ? 1 : 0;
     
         let opponentName = $(innings[opponentIndex]).find("h5").text();
         opponentName = opponentName.split("INNINGS")[0].trim();   
          
         let Cinnning = $(innings[i])  
         let allRows = $('.table.batsman tbody tr') 

          for (let j = 0;j<allRows.length ; j++){  

            let allCols = $(allRows[j]).find('td') 
            let isWorthy = $(allCols[0]).hasClass('batsman-cell') 
             

            if(isWorthy==true){ 
               

               let playerName = $(allCols[0]).text().trim() 
              let runs = $(allCols[2]).text().trim() 
              let balls = $(allCols[3]).text().trim() 
              let fours= $(allCols[5]).text().trim() 
              let sixes = $(allCols[6]).text().trim() 
              let STR = $(allCols[7]).text().trim() 
               console.log( 
                 `${playerName} | ${runs} | ${balls} | ${fours}| ${sixes} ${STR}` 
               ); 
               processPlayer(teamName, playerName, runs,balls,fours,sixes,STR,opponentName ,venue,result,date);
 
            }

          }
          console.log('.......................................................................')
          
 

       //  console.log(venue,date,teamName,opponentName,result)
        


  }

  //console.log(htmlString)
  
}  
 
 
 function processPlayer(teamName,  playerName, runs, balls,fours,sixes, STR, opponentName, venue,result,date){
let teamPath = path.join(__dirname,"IPL",teamName) 
dirCreator(teamPath);  

 let filePath = path.join(teamPath,playerName + ".xlsx")
let content = excelReader(filePath, playerName) 
let playerObj = {
  teamName,
    playerName,
    runs,
    balls,
    fours,
    sixes,
    STR,
    opponentName,
    venue,
    result,date
} 
content.push(playerObj)
excelWriter(filePath , content , playerName)

 }  
  
 function dirCreator(filepath){ 
  if(fs.existsSync(filepath)== false){ 
         fs.mkdirSync(filepath)

  }

}
function excelWriter(filePath, jsonData, sheetName) {
  let newWB = xlsx.utils.book_new();
  // Add new WorkBook
  let newWS = xlsx.utils.json_to_sheet(jsonData);
  // This will take JSON and will convert into Excel Format
  xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
  xlsx.writeFile(newWB, filePath);
}

function excelReader(filePath, sheetName) {
  if (fs.existsSync(filePath) == false) {
    return [];
  }

  let wb = xlsx.readFile(filePath);
  // which excel file to read
  let excelData = wb.Sheets[sheetName];
  // pass the sheet Name
  let ans = xlsx.utils.sheet_to_json(excelData);
  // conversion from sheet to JSON
  return ans;
}



 module.exports = { 
   ps: processScoreCard

 }

