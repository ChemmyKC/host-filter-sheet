
const fetch = require("node-fetch");
const Cheerio = require("cheerio");
const express = require("express");
const app = express();
const fs = require('fs').promises
const path = require("path")
  function sliceTable($,rows, exept){
    // console.log("First: "+$(rows).children().length)
    let head = $(rows).children().slice(0,8)
    $(rows).html("")
    $(rows).append(head)
    
    // console.log("Second: "+$(rows).children().length)
    for(let j = 0;j < exept.length; j++){
        try{
          $(rows).append(exept[j])
        }catch(e){
          console.log(e)
        }
    }
    // console.log("Third : "+$(rows).children().length)
    // for(let y = 0;y<$(colmns).length;y+=1){
          //   // console.log($($(colmns)[y]).text())
          // }
  }
  async function updateSheet() {
    let hosts = "A14lifee, bae0921, Boss_Tasha, bree69, brialexandra, Capricornia, Carovi, cecejackson, chasedolly, chemmy, darealbigboss, durtydurty, EIGHTTRAY, EnamouredBeauty, FUDGE.H8TERS.I, IndianRosh, hai_noon, hazey_love, HBOMAX, htx_lauhrynn, ilovemyson03, jessicarabbitt, kali_luvv, Ladyy__Kayyy, LootTheBody, Lou1104, lovespeacehappy, mamared, MrsJoness, MrSnatchYaSoul, neeci4376, NICOLAcorreia19, nwabigtee, poetsoul, pumpkinpie1984, queen_of_resin, realtime_tv, rebae, RENZEL_, ShowTymeLive, smalltownheart, soulfulsinger, SouthernBelle95, Stonjalive, streetp, SushiiB, t3ddyst3ady, therealcannamom, Therealkountry, THICCIUMZZ, tpld, ashlenn, goldylocx, bree69, MelodicDreams, Sagittaruis1990, Bossbred, Dee6235, Teebabyparis, YapaYapa, VTWEEZY, 410Dee, 77cortez, 0512020105W, 28Remi10";
    let $;
    try{
    let res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vT35hQfliBs6sqjOItMa7HsSHd6TXKgnuYLaopIWKkM_pqYvof7XvBo823gee2mgUIWkuOXuvo8CFXj/pubhtml')
    $ = await Cheerio.load(await res.text());
    }catch(e){
        return "<h1>Try Again</h1>"
    }
    let data = [];
    let table;
    hosts = hosts.split(", ")
    let valid ;
    for(let j = 1;j<$("tbody").length;j++){
      table = $("tbody")[j].children
      // console.log($(table).length)
      for(let i = 8;i < $(table).length; i+=2){
        hosts.forEach(host=>{
          if($($(table)[i]).text().includes(host) || $($(table)[i+1]).text().includes(host)){
            for (let z = 1; z < $($(table)[i]).children().length; z += 5) {
                let colmn = $($(table)[i]).children().slice(z, z + 5);
                let colmn1 = $($(table)[i+1]).children().slice(z, z + 5);
                if(!$(colmn).text().includes(host) && !$(colmn1).text().includes(host)){
                  $(colmn).each((idx,elm)=>{
                    $(elm).empty()
                  })
                  $(colmn1).each((idx,elm)=>{
                    $(elm).empty()
                  })
                }
                // do whatever
            }
            data.push($($(table)[i]).prop('outerHTML'))
            data.push($($(table)[i+1]).prop('outerHTML'))
            // console.log($($(table)[i]).text()+" VS " + $($(table)[i+1]).text())
          }
        })
      }
      sliceTable($,$("tbody")[j],data)
      data = []
    }
    $('.softmerge-inner').css('width', "100% !important");
    $("#doc-title").append("<span style='color:grey'> Last filter update :  " + new Date().toLocaleString() + "</span>")
    let root = $.root().prop('outerHTML');
    await fs.writeFile((path.join(__dirname + '/sheet/index.html')), root);
    // return root
    // await $(".s39").each((idx,elm)=>{
    //   data.push($(elm).text())
    //   if (idx == 40)
    //     console.log($(elm).parent().prop('outerHTML'))
    // })
    // let filtredData = [];
    // hosts = hosts.split(", ")
    // console.log(hosts.length)
    // hosts.forEach(host=>{
    //   data.forEach(elm=>{
    //     if(elm.includes(host)){
    //       filtredData.push(host)
    //     }
    //   })
    // })
    // console.log(filtredData)
  }
// let sheet = "loading..."

app.listen(3000, async() => {
console.log("Application started and Listening on port 3000");
await updateSheet()
setInterval(async()=>{
    try{
    sheet = await updateSheet()
    console.log("updated")
    }catch(e){
        console.log(e)
    }
},60000)
});
//Add last update date
//Get css from server
app.get("/", async(req, res) => {
  res.sendFile((path.join(__dirname + '/sheet/index.html')));
});