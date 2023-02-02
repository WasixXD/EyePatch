const { workerData, threadId } = require('node:worker_threads')
const jimp = require('jimp')

async function convert(image, index, resize) {
  let pallete = "Ñ@#W$9876543210?!abc;:+=.;_ "
  let art = ""
  //resize for more fast parse
  if(image.getWidth() >= image.getHeight()) {
    image.resize(jimp.AUTO, resize)
  } else {
    image.resize(resize, jimp.AUTO)
  }
  let ascii_image = new jimp(image.getWidth() * 10, image.getHeight() * 10, "white")
  let i = 0
  jimp.loadFont(jimp.FONT_SANS_16_BLACK)
    .then(font => {
        // create ascii art 
        for(let y = 0; y < image.getHeight(); y++) {
          for(let x = 0; x < image.getWidth(); x++) {

            
            let { r, g, b} = jimp.intToRGBA(image.getPixelColor(x, y))
            let luminosity = r * 0.3 + g * 0.59 + b * 0.11
            let caracter = Math.floor(((luminosity / 255.0) * pallete.length - 1))
            let ascii = pallete[caracter]  
            art += ascii
        
        
          }
          // add to file
          i += 10
          ascii_image.print(font,0 , i, art)
          art = ""

        }
     
    return ascii_image
  })
    .then(async image => {
        //create img file with ascii
      
       return image.write(`./video_assets/${index}`)
    })
  
  
}


async function main() {
  
  for(let i of workerData.workerFiles) {
  
    let image =await jimp.read("./screenshots/" + i)
    await convert(image, i, workerData.size)

  }



}

main()
