let params = {
  cameraX: 0,
  cameraY: 150,
  cameraZ: 0, // zoom
  rotateX: 0,
  rotateY: 0, // ***
  rotateZ: 0,
  rotateAdj: 1,
  flowAdj:1,
  perlinNoise: 0.01,
  showVehicles: true,
  backgroundLight: 0,
  // horizental_sides: 24,
  // vertical_sides: 24
}

let gui = new dat.gui.GUI();
gui.add(params, 'rotateAdj').min(1).max(4).step(0.1);
gui.add(params, 'flowAdj').min(1).max(2).step(0.1);
gui.add(params, 'perlinNoise').min(0.01).max(0.1).step(0.01);
gui.add(params, 'showVehicles');
gui.add(params, "backgroundLight").min(0).max(100).step(1);
// gui.add(params, "horizental_sides").min(3).max(24).step(1);
// gui.add(params, "vertical_sides").min(3).max(24).step(1);


// Basic setup

// document.getElementById('music').play();

// let sun;
// let moon;
let devices = {};
let RESOLUTION = 100;
let line_weight = 0.07;
let sphere_weight = 0.7;
let radius = 0.075;
let camera_speed = 3;
let vehicles_1 = [];
let vehicles_2 = [];
let horizental_sides;
let vertical_sides;
// let song;
// let lines = [];

// function preload() {
//   sun = loadModel('sun.obj', true);
//   //moon = loadModel('moon.obj', true);
// }

// function preload(){
//   soundFormats('mp3');
//   song = loadSound('coming_down.mp3');
//   song.setVolume(0.2);
// }

function setup() {
  //bluetooth
  createCanvas(windowWidth, windowHeight, WEBGL);
  imuConnection.onSensorData((device) => {
      devices[device.deviceId] = device.data;
  });

  angleMode(RADIANS);
  createCanvas(windowWidth, windowHeight, WEBGL);
  blendMode(ADD);
  // noCursor();

  // instruction setup
  // textSize(50);
  // textFont("sans-serif");
  // fade = 0;
  // song = loadSound('coming_down.mp3');
  // song.setVolume(0.2);
  // index setting
  cols = 10;
  rows = 2;
  deps = 20;

  for(let z = -1500; z < 500; z+=RESOLUTION){
    
      for(let x = -500; x < 500; x+=RESOLUTION){

        // in order to get 3d array into 1d array
        let c = ceil((x+500) / RESOLUTION);
        let d = ceil((z+1500) / RESOLUTION);

        let index = c + d * cols

        if ((c+d)%2==0) {
          let a = (index*PI/5)%(2*PI);
          //console.log(a);
          vehicles_1.push(new Vehicle(x, 0, z, a));
        } else 
        {
          let a = (index*PI/5)%(2*PI);
          //console.log(a);
          vehicles_2.push(new Vehicle(x, 0, z, a));
        }
      }
    }
  }


function draw(){
  // song.play();
  let devices_ID = [];
  //imu data
  for (let deviceId in devices) {

    devices_ID.push(deviceId);
    // let data = devices[deviceId];
    // drawDevice(data);
    // console.log(deviceId);
    // console.log(data.euler);
  }

  // console.log(devices_ID.length);


  // background(params.backgroundLight,0,0);
  // background(0);
  background(50+cos(frameCount*0.002)*50, 10+cos(frameCount*0.002)*10, 10+cos(frameCount*0.002)*10);
  changeView();

  translate(params.cameraX, params.cameraY, params.cameraZ);
  rotateX(params.rotateX);
  rotateY(params.rotateZ);
  rotateZ(params.rotateY);


  if (devices_ID.length>1)
  {
    let data= devices[devices_ID[1]];
    let euler = data.euler;
    if (euler[0]>90)
    {
      euler[0]=90;
    }
    if (euler[0]<-90)
    {
      euler[0]=-90;
    }
    if (euler[1]>45)
    {
      euler[1]=45;
    }
    if (euler[1]<-45)
    {
      euler[1]=-45;
    }
    if (euler[2]>180)
    {
      euler[2]=180;
    }
    // console.log(euler);
    vertical_sides = ceil(13 + euler[0]/9);
    horizental_sides = ceil(13 + euler[1]/5);
    rotate_spd = 1000 + 20*euler[2];
  } else 
  {
    vertical_sides = 12;
    horizental_sides = 12;
    rotate_spd = 2000;
  }

  console.log(vertical_sides, horizental_sides);

  push();
  // console.log(frameCount);
  // console.log(sin(frameCount*0.01));
  translate(sin(frameCount*0.002)*4500,1500-cos(frameCount*0.002)*3000,-3000);
  noFill();
  stroke(205, 0, 0);
  strokeWeight(5);
  rotateY(millis() / rotate_spd);
  sphere(500, horizental_sides, vertical_sides);
  pop();

  push();
  translate(-sin(frameCount*0.002)*4500,1500+cos(frameCount*0.002)*3000,-3000);
  noFill();
  stroke(65, 105, 225, 100);
  strokeWeight(5);
  rotateY(millis() / rotate_spd);
  sphere(500, horizental_sides, vertical_sides);
  pop();

  if (params.showVehicles == true) {
    //console.log('show');
    //console.log(vehicles.length);
    stroke(255);
    if (devices_ID.length>0){
    let data= devices[devices_ID[0]];
    let euler = data.euler;
    if (euler[0]>90)
    {
      euler[0]=90;
    }
    if (euler[0]<-90)
    {
      euler[0]=-90;
    }
    if (euler[1]>45)
    {
      euler[1]=45;
    }
    if (euler[1]<-45)
    {
      euler[1]=-45;
    }
    if (euler[2]>180)
    {
      euler[2]=180;
    }
    // console.log(euler);
    // console.log(75+euler[1]/4);
    // console.log(euler[1]);
    // console.log(devices_ID[0]);
    // console.log(euler);
    for (let i = 0; i < vehicles_1.length; i++) {
      //console.log(i);
      let v = vehicles_1[i];
      // let c = floor(v.pos.x+600 / RESOLUTION);
      // let r = floor(v.pos.y+600 / RESOLUTION);
      // let d = floor(v.pos.z+1000 / RESOLUTION);
      // let index = c + r * cols + rows*cols*d;
      
      
        if ((v.height<=(75+euler[1])) && (v.height>=-(75+euler[1])))
        {
          v.range = 75+euler[1];
        }
      
      v.freq = PI/(450+euler[0]*4);
      v.update();
      strokeWeight(sphere_weight);
      // v.display();
      strokeWeight(line_weight);
      if (i-cols/2>=0)
      { 
        let m = vehicles_1[i-cols/2];
        line(v.pos.x, v.pos.y, v.pos.z, m.pos.x, m.pos.y, m.pos.z);
      }
      if (i+cols/2<vehicles_1.length)
      { 
        let n = vehicles_1[i+cols/2];
        line(v.pos.x, v.pos.y, v.pos.z, n.pos.x, n.pos.y, n.pos.z);
      }
      if((i/5)%2>=1 && (i/5)%2<1.7)
      {
        if (i-cols/2+1>=0)
        { 
          let m = vehicles_1[i-cols/2+1];
          line(v.pos.x, v.pos.y, v.pos.z, m.pos.x, m.pos.y, m.pos.z);
        }
        if (i+cols/2+1<vehicles_1.length)
        { 
          let n = vehicles_1[i+cols/2+1];
          line(v.pos.x, v.pos.y, v.pos.z, n.pos.x, n.pos.y, n.pos.z);
        }
      }
    }
    
    
  
    // console.log(devices_ID[1]);
    // console.log(euler);
    for (let i = 0; i < vehicles_2.length; i++) {
      let w = vehicles_2[i];
      // let c = floor(v.pos.x+600 / RESOLUTION);
      // let r = floor(v.pos.y+600 / RESOLUTION);
      // let d = floor(v.pos.z+1000 / RESOLUTION);
      // let index = c + r * cols + rows*cols*d;
      
      
        if ((w.height<=(75+euler[1])) && (w.height>=-(75+euler[1])))
        {
          w.range = 75+euler[1];
        }
      
      w.freq = PI/(90+euler[2]*4);
      w.update();
      strokeWeight(sphere_weight);
      // w.display();
      strokeWeight(line_weight);
      if (i-cols/2>=0)
      { 
        let m = vehicles_2[i-cols/2];
        line(w.pos.x, w.pos.y, w.pos.z, m.pos.x, m.pos.y, m.pos.z);
      }
      if (i+cols/2<vehicles_1.length)
      { 
        let n = vehicles_2[i+cols/2];
        line(w.pos.x, w.pos.y, w.pos.z, n.pos.x, n.pos.y, n.pos.z);
      }
      if((i/5)%2>1 && (i/5)%2<2)
      {
        if (i-cols/2-1>=0)
        { 
          let m = vehicles_2[i-cols/2-1];
          line(w.pos.x, w.pos.y, w.pos.z, m.pos.x, m.pos.y, m.pos.z);
        }
        if (i+cols/2-1<vehicles_1.length)
        { 
          let n = vehicles_2[i+cols/2-1];
          line(w.pos.x, w.pos.y, w.pos.z, n.pos.x, n.pos.y, n.pos.z);
        }
      }
    }
    }
  }

  // push();
  // noFill();
  // translate(0, -600, -1000);
  // stroke(255, 0, 0);
  // strokeWeight(0.5);
  // scale(2,2,2);
  // model(sun);
  // pop();

  // push();
  // translate(width/10-360,height/8-3000,-4000);
  // // fill(255,0,0);
  // noFill();
  // stroke(255,0,0);
  // strokeWeight(10);
  // sphere(1500);
  // pop();

}

// function drawLine(x1, y1, z1, x2, y2, z2,angle,strokeValue) {
//   push();
//   beginShape();
//   translate(x1 - RESOLUTION/2, y1 - RESOLUTION/2, z1 - RESOLUTION/2);
//   strokeWeight(strokeValue);
//   fill(255,20,30);
//   vertex(x1, y1, z1);
//   vertex(x2, y2, z2);
//   endShape();
//   pop();
// }

class Vehicle {
  constructor(x, y, z, a) {
    this.pos = createVector(x, y, z);
    //console.log(this.pos);
    this.freq=0;
    this.angle = a;
    this.range =0;
    this.x = x;
    this.y = y;
    this.z = z;
    this.height = this.range*sin(this.angle);
    // this.dep = this.range*sin(this.angle)*0.5;
  }
  update() {
    // if (this.height>this.range){
    //   console.log('alert');
    // }
    while (this.angle>=2*PI)
    {
      this.angle -= 2*PI;
    }
    if (this.angle < PI/2 && this.angle >=0)
    {
      this.angle = asin(this.height/this.range);
    }
    if (this.angle >= PI/2 && this.angle < 3*PI/2)
    {
      this.angle = PI - asin(this.height/this.range);
    }
    if (this.angle >= 3*PI/2 && this.angle < 2*PI)
    {
      this.angle = 2*PI + asin(this.height/this.range);
    }
    this.angle+=this.freq;
    while (this.angle>=2*PI)
    {
      this.angle -= 2*PI;
    }
    this.height = this.range*sin(this.angle);
    // this.dep = this.range*sin(this.angle)*0.5;
    this.pos.x = this.x; 
    this.pos.y = this.y + this.height;
    this.pos.z = this.z;
    //console.log(this.pos);
    //console.log(this.height);
  }

  display() {
    push();
    noFill();
    translate(this.pos.x, this.pos.y,this.pos.z);
    stroke(255,10);
    sphere(RESOLUTION*radius);
    pop();
  }
}

function changeView(){
  let speed = 5;
  let rotateSpeed = 0.01;
  //camera x y z
  if(keyIsDown(LEFT_ARROW)){
    params.cameraX += speed;
  }
  if(keyIsDown(RIGHT_ARROW)){
    params.cameraX -= speed;
  }

  if (keyIsDown(UP_ARROW)) {
    params.cameraZ += speed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    params.cameraZ -= speed;
  }

  if (keyIsDown(80)) {
    params.cameraY += speed;
  }
  if (keyIsDown(76)) {
    params.cameraY -= speed;
  }

  // if (params.cameraZ > 800) {
  //   params.cameraZ = -800;
  // }
  // if (params.cameraZ < -800) {
  //   params.cameraZ = 800;
  // }
  // if (params.cameraX > 400) {
  //   params.cameraX = -400;
  // }
  // if (params.cameraX < -400) {
  //   params.cameraX = 400;
  // }
  // if (params.cameraY > 400) {
  //   params.cameraY = -400;
  // }
  // if (params.cameraY < -400) {
  //   params.cameraY = 400;
  // }


  // rotate X Y Z
  if(keyIsDown(81)){
    params.rotateX += rotateSpeed;
  }
  if(keyIsDown(87)){
    params.rotateX -= rotateSpeed;
  }

  if(keyIsDown(65)){
    params.rotateY += rotateSpeed;
  }
  if(keyIsDown(83)){
    params.rotateY -= rotateSpeed;
  }

  if(keyIsDown(90)){
    params.rotateZ += rotateSpeed;
  }
  if(keyIsDown(88)){
    params.rotateZ -= rotateSpeed;
  }

  // speed
  if (keyIsDown(32)) {
    speed += 5;
  }


}

// q w rotateX
// 81 87

// a s rotateY
// 65 83

// z x rotateZ
// 90 88

// left right cameraX

// p l cameraY
// 80 76

// up down cameraZ

// space speed up
// 32

// r t perlin noise
// 82 84

function keyPressed(evt) {
  if (evt.key.match(/b/i)) {
      imuConnection.bleConnect();
  }
}