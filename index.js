#! /usr/bin/env node

const fs = require("node:fs");
const ffmpeg = require('fluent-ffmpeg')
const jimp = require('jimp')
const path = require('node:path')
const { execSync, spawn, exec } = require('node:child_process')
const { program } = require('commander');
const spinnies = require('spinnies')
const { exit } = require("node:process");

const spin = new spinnies()
let acess = false


async function render(output) {

  spin.add("render", {text: "Rendering video..."})
  
  //ffmpeg -r 25 -s 1920x1080 -i video_assets/%d.png -vcodec libx264 -crf 25 -pix_fmt yuv420p test.mp4
  
  let shots = await fs.readdirSync("./screenshots/")
  let assets = await fs.readdirSync("./video_assets/")
  if(acess) {
    let video = await execSync(`ffmpeg -r 25 -s 1920x1080 -i ${path.resolve('video_assets')}/%d.png -vcodec libx264 -crf 25 -pix_fmt yuv420p ${output}`, (err, out, stderr) => {
      if(err) throw err
      console.log(out)
    }) 
  //remove the files
  }
  for(let i of assets) {
    fs.unlinkSync(`./video_assets/${i}`)
  }
  for(let i of shots) {

    fs.unlinkSync(`./screenshots/${i}`)
  }
  spin.succeed("render", {text: `Video rendered at ${output}`})
}


async function convert(image, index) {
  let pallete = "Ñ@#W$9876543210?!abc;:+=.;_ "
  let art = ""
  //resize for more fast parse
  image.resize(50, jimp.AUTO)
  let ascii_image = new jimp(400, 800, "black")

  jimp.loadFont(jimp.FONT_SANS_16_WHITE)
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
          ascii_image.print(font, (image.getWidth() / 10), y * (image.getHeight() / 10), art)
          art = ""

        }
     
    return ascii_image
  })
    .then(async image => {
        //create img file with ascii
      
       return image.write(`./video_assets/${index}`)
    })
  
  
}



async function image_to_ascii(file_path, output) {
  spin.add("spinnier_frames", {text: "Generating frames..."})
  let frames = execSync(`ffmpeg -i ${file_path} ./screenshots/%d.png`)
  let image_paths = await fs.readdirSync('./screenshots/')
  spin.succeed("spinnier_frames", {text: "Frames generated"})
  acess = false
  spin.add("spinnier_convert", {text: "Generating ascii art..."})
  for(let i of image_paths ) {
    let image = await jimp.read("./screenshots/" + i)
     
    
    await convert(image, i)
    
  }

  spin.succeed("spinnier_convert", {text: "Art generated"})

  await setTimeout(async () => {
    acess = true
    await render(output)
  }, 5000)
   
}


program 
  .command("convert")
  .description("Convert a video file to a ascii video")
  .argument("<string>", "video path")
  .option("--color", "set the background color")
  .option("--output <string>", "choose the output file name")
  .action(async (str, options) => {
    const filePath = path.resolve(str)
    const fileExist = await fs.existsSync(filePath)
    const outputPath = options.output? options.output : null
    if(!fileExist) {
      throw new Error("File does not exist")
      exit(0)
    }

    if(!outputPath) {
      throw new Error("Must provide a output path")
      exit(0)
    } 
    
    image_to_ascii(filePath, outputPath) 
  })


program.parse()





