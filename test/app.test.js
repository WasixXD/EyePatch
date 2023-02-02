const ffmpeg = require('fluent-ffmpeg')
const fs = require('node:fs')
const path = require('node:path')
const { exec } = require('node:child_process')

describe("Creating images", () => {
  test("Use ffmpeg to create images", async () => {
    let result = fs.existsSync(path.resolve('output.png'))
    if(result) {
      expect(result).toBe(true)
    } else {
      exec('ffmpeg -i ./hand.mp4 -ss 00:00:01 -vframes 1 ./test/screenshot/output.png')
      .on('close', () => {
        let response = fs.existsSync(path.resolve('output.png'))
        expect(response).toBe(true)
      })
    
    }
     



  })
})
