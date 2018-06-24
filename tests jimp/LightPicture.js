"use strict";

var LightGrid = require("./LightGrid.js");
var Jimp = require("jimp");

class LightPicture {
   constructor(size, outputpath, callback){
      this.lightGrid = new LightGrid(size);
      this.picture;
      this.path = outputpath;

      this.constantes = { // TODO: move these as real static constants
         pictureDimention: 500,
         workingDimention: 600
      }

      // console.log(`A new LightPicture of size ${size}.`);
      var actualCellDimention = Math.floor(this.constantes.workingDimention / this.lightGrid.length);
      var actualDimention = this.lightGrid.length * actualCellDimention;
      // console.log(`actual dimention: ${actualDimention} et actual cell dimensions: ${actualCellDimention}.`);


      const rose = {r: 255, g:100, b:100, a:255};
      // var color;

      // Make the picture
      this.picture = new Jimp(actualDimention, actualDimention, 0xFFFFFFFF, (err, image) => {
         this.lightGrid.forEachFilled( (x, y, i, state) => {
            var startX = x * actualCellDimention;
            var startY = y * actualCellDimention;
            // console.log(`in forEach ${x}, ${y}, ${i}, startX ${startX}, startY ${startY}`);

            // which color are we filling with
            if (state === LightGrid.FILLED) {
               // console.log(`cell is filled`);
               var color = rose;
            } else if (state === LightGrid.WINNING) {
               // console.log("cell is winning");
               var extra = 40+Math.random()*50;
               // console.log(`extra is ${extra}`);
               var rosePale = {
                  r: rose.r,
                  g: rose.g + extra,
                  b: rose.b + extra,
                  a: rose.a
               };
               var color = rosePale;
            }

            // Apply the color in the cell
            image.scan(startX, startY, actualCellDimention, actualCellDimention, (x, y, index) => {
               // console.log("tout dedans");
               image.bitmap.data[index+0] = color.r;
               image.bitmap.data[index+1] = color.g;
               image.bitmap.data[index+2] = color.b;
               image.bitmap.data[index+3] = color.a;
            });
         });
         var level = size-1;
         var a=32, c=1.14, b=1, h=20, k=-2;
         var luminosity = a*Math.pow(c,(b*(level-h)))+k;
         var hue = ((size-2)*23.4 % 360) - 360;

         // console.log("1: before color");
         image.color([
             { apply: 'hue', params: [ hue ] },
             { apply: 'lighten', params: [ luminosity ] }
         ]);
         // console.log(`Luminosity ${luminosity} and hue ${hue}`);
         image.resize(500, Jimp.AUTO);
         // console.log("2: after resize, before write");
         // console.log(`writing to ${this.path}`)
         image.write(this.path, (err, res)=>{
            if (err) {
               if (callback) {
                  callback(err, null);
               }
            } else {
               // console.log("Wrote to "+this.path+".");
               if (callback) {
                  callback(null, this);
               }
            }
         });
         // console.log("3: after asking to write, probably before writing is done");
      });
   }

   get won() {
      return this.lightGrid.won;
   }

}
module.exports = LightPicture;