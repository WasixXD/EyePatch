#! /usr/bin/env node

const fs = require("node:fs");
const jimp = require('jimp')
const path = require('node:path')
const { execSync, spawn, exec } = require('node:child_process')
const { program } = require('commander');
const spinnies = require('spinnies')
const { exit } = require("node:process");
const { Worker } = require('node:worker_threads')


const spin = new spinnies()
const NUMBER_OF_WORKERS = 5


async function render(output) {
  
  spin.add("render", {text: "Rendering video..."})
  
  //ffmpeg -r 25 -s 1920x1080 -i video_assets/%d.png -vcodec libx264 -crf 25 -pix_fmt yuv420p test.mp4
  
    let video = await execSync(`ffmpeg -r 25 -s 1920x1080 -i ${path.resolve('video_assets')}/%d.png -vcodec libx264 -crf 25 -pix_fmt yuv420p ${output}`, (err, out, stderr) => {
      if(err) throw err
      console.log(out)
    }) 
  //remove the files
  spin.succeed("render", {text: `Video rendered at ${output}`})
  exit(0)
}




async function image_to_ascii(file_path, output, size) {
  spin.add("spinnier_frames", {text: "Generating frames..."})
  let frames = await execSync(`ffmpeg -i ${file_path} ./screenshots/%d.png`)
  spin.succeed("spinnier_frames", {text: "Frames generated"})
  let image_paths = await fs.readdirSync('./screenshots/')
  let numberOfPaths = image_paths.length
  //separate worker configs
  let filePerWorker = Math.floor((image_paths.length - 1) / NUMBER_OF_WORKERS)
  // in any number that N % 5 != 0 we need to take care off the remaining files
  let rest = (image_paths.length - 1) % NUMBER_OF_WORKERS
  let workers = [] 
 
  spin.add("spinnier_convert", {text: "Generating ascii art..."})
  //number of workers
  for(let i = 0; i < NUMBER_OF_WORKERS; i++) {
    let workerFiles = image_paths.splice(0, filePerWorker)
    // throw the rest in last worker_threads
    if(i == NUMBER_OF_WORKERS - 1) {
      workerFiles.push(...image_paths) 
    }
    workers.push(new Worker('./worker.js', {workerData: { workerFiles, size }}))
  }

  
  //  check every .5s to wait workers do their job
  setInterval(async () => {
    let dir = fs.readdirSync('./video_assets/').length
    if(dir == numberOfPaths) {
    
      spin.succeed("spinnier_convert", {text: "Art generated"})
      await render(output)
    }
  }, 500)
   
}


program 
  .command("convert")
  .description("Convert a video file to a ascii video")
  .argument("<string>", "video path")
  .option("--output <string>", "choose the output file name")
  .option("--size <int>", "choose the video size") 
  .action(async (str, options) => {
    let size = 50
    let shots = await fs.readdirSync("./screenshots/")
    let assets = await fs.readdirSync("./video_assets/")

  for(let i of assets) {
    fs.unlinkSync(`./video_assets/${i}`)
  }
  for(let i of shots) {

    fs.unlinkSync(`./screenshots/${i}`)
  }
    const filePath = path.resolve(str)
    const fileExist = await fs.existsSync(filePath)
    const outputPath = options.output? options.output : null
    if(!fileExist) {
      throw new Error("File does not exist")
      exit(0)
    }
  if(options.size) {
      size = parseInt(options.size)
    }

    if(!outputPath) {
      throw new Error("Must provide a output path")
      exit(0)
    } 
    image_to_ascii(filePath, outputPath, size)
  })


program.parse()





