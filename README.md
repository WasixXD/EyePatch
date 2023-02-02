```
 /$$$$$$$$                                                 /$$               /$$      
| $$_____/                                                | $$              | $$      
| $$       /$$   /$$  /$$$$$$         /$$$$$$   /$$$$$$  /$$$$$$    /$$$$$$$| $$$$$$$ 
| $$$$$   | $$  | $$ /$$__  $$       /$$__  $$ |____  $$|_  $$_/   /$$_____/| $$__  $$
| $$__/   | $$  | $$| $$$$$$$$      | $$  \ $$  /$$$$$$$  | $$    | $$      | $$  \ $$
| $$      | $$  | $$| $$_____/      | $$  | $$ /$$__  $$  | $$ /$$| $$      | $$  | $$
| $$$$$$$$|  $$$$$$$|  $$$$$$$      | $$$$$$$/|  $$$$$$$  |  $$$$/|  $$$$$$$| $$  | $$
|________/ \____  $$ \_______/      | $$____/  \_______/   \___/   \_______/|__/  |__/
           /$$  | $$                | $$                                              
          |  $$$$$$/                | $$                                              
           \______/                 |__/                                              

  ```                     
  
# Brief 📖
I already me a image to ascii, and why not a video converter


# Challenges 🐢
- Process large images fast
- Transform image to ascii
- Transform ascii into video


# Goals 🏆
- [ x ] Very fast video processing
- [ x ] Video to ascii!
- [ x ] Use worker_threads in nodejs
- [ x ] Support many video types


# How it works? 💼
So first you pass the video path and the output, then through FFMPEG it split all the video frames and it calculates and separe files for the workers transform the frame into a image containing the ascii art. And for the render it also use FFMPEG via terminal.


# How to install 🚀
## ATTENTION: to be able to run you *must* have FFMPEG installed in your terminal and setted on PATH
- Create a folder
```
mkdir eyePatch
cd eyePatch
``` 
- Clone the repository
```
git clone https://github.com/WasixXD/EyePatch.git
```
- install depedencys and install the program globaly
```
npm install
npm i -g .
```

# How to use 👷
- If have already installed globaly then just type
```
eye convert file.mp4 --size 50 --output output.mp4
```

# 🧵 How concurrency optimized the project
We know that video processing is a hard job for both humans and machines, even more to Javascript that is not a super fast language, so i needed a method that could convert hundreds of images hyper fast without blocking the main thread. Then our heroes the Workers from `node:worker_threads` come in handy. \
\
This graph is based on a file with 77 frames \
\
<img src="https://github.com/WasixXD/EyePatch/blob/master/workersGraph.png?raw=true" />

We can observe that the higher the workers working in multiple frames that fast the program execute, making working with a video with a thousand frames simpler and easy to to deal. 


# ▶️ DEMO
<img src="https://github.com/WasixXD/EyePatch/blob/master/hand_1.gif?raw=true"/> <img src="https://github.com/WasixXD/EyePatch/blob/master/output_1.gif?raw=true" /> 
\
\
\
PS: Works better in vertical videos P-)
