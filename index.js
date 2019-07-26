const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
let app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/nearest-color', function(request, response) {
  ntc.init();
  console.log(ntc.name(request.body.color));      // your JSON
  response.send(ntc.name(request.body.color));    // echo the result back
});


app.listen(PORT);
console.log("Server running on port " + PORT + "/nearest-color");

var ntc = {

  init: function() {
    var color, rgb, hsl;
    for(var i = 0; i < ntc.names.length; i++)
    {
      color = "#" + ntc.names[i][0];
      rgb = ntc.rgb(color);
      hsl = ntc.hsl(color);
      ntc.names[i].push(rgb[0], rgb[1], rgb[2], hsl[0], hsl[1], hsl[2]);
    }
  },

  name: function(color) {

    color = color.toUpperCase();
    if(color.length < 3 || color.length > 7)
      return ["#000000", "Invalid Color: " + color, false];
    if(color.length % 3 == 0)
      color = "#" + color;
    if(color.length == 4)
      color = "#" + color.substr(1, 1) + color.substr(1, 1) + color.substr(2, 1) + color.substr(2, 1) + color.substr(3, 1) + color.substr(3, 1);

    var rgb = ntc.rgb(color);
    var r = rgb[0], g = rgb[1], b = rgb[2];
    var hsl = ntc.hsl(color);
    var h = hsl[0], s = hsl[1], l = hsl[2];
    var ndf1 = 0; ndf2 = 0; ndf = 0;
    var cl = -1, df = -1;

    for(var i = 0; i < ntc.names.length; i++)
    {
      if(color == "#" + ntc.names[i][0])
        return ["#" + ntc.names[i][0], ntc.names[i][1], true];

      ndf1 = Math.pow(r - ntc.names[i][2], 2) + Math.pow(g - ntc.names[i][3], 2) + Math.pow(b - ntc.names[i][4], 2);
      ndf2 = Math.pow(h - ntc.names[i][5], 2) + Math.pow(s - ntc.names[i][6], 2) + Math.pow(l - ntc.names[i][7], 2);
      ndf = ndf1 + ndf2 * 2;
      if(df < 0 || df > ndf)
      {
        df = ndf;
        cl = i;
      }
    }
    let jsonToReturn = (cl < 0 ? ["#000000", "Invalid Color: " + color, false] : ["#" + ntc.names[cl][0], ntc.names[cl][1], false]);;
    if (cl < 0) {
      jsonToReturn = '{"color": "' + color + '"}';
    } else {
      jsonToReturn = '{"color": "' + ntc.names[cl][1] + '"}';
    }
    return jsonToReturn;
  },

  // adopted from: Farbtastic 1.2
  // http://acko.net/dev/farbtastic
  hsl: function (color) {

    var rgb = [parseInt('0x' + color.substring(1, 3)) / 255, parseInt('0x' + color.substring(3, 5)) / 255, parseInt('0x' + color.substring(5, 7)) / 255];
    var min, max, delta, h, s, l;
    var r = rgb[0], g = rgb[1], b = rgb[2];

    min = Math.min(r, Math.min(g, b));
    max = Math.max(r, Math.max(g, b));
    delta = max - min;
    l = (min + max) / 2;

    s = 0;
    if(l > 0 && l < 1)
      s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));

    h = 0;
    if(delta > 0)
    {
      if (max == r && max != g) h += (g - b) / delta;
      if (max == g && max != b) h += (2 + (b - r) / delta);
      if (max == b && max != r) h += (4 + (r - g) / delta);
      h /= 6;
    }
    return [parseInt(h * 255), parseInt(s * 255), parseInt(l * 255)];
  },

  // adopted from: Farbtastic 1.2
  // http://acko.net/dev/farbtastic
  rgb: function(color) {
    return [parseInt('0x' + color.substring(1, 3)), parseInt('0x' + color.substring(3, 5)),  parseInt('0x' + color.substring(5, 7))];
  },

  names: [
    ["000000", "Black"],
    ["000080", "Navy Blue"],
    ["0000FF", "Blue"],
    ["007FFF", "Azure"],
    ["008080", "Teal"],
    ["00FF00", "Green"],
    ["00FFFF", "Cyan"],
    ["0E0E18", "Cinder"],
    ["FFFFF0", "Ivory"],
    ["FFFFFF", "White"],
    ["7FFFD4", "Aquamarine"],
    ["D2B48C", "Tan"],
    ["F5DEB3", "Wheat"],
    ["C3B091", "Khaki"],
    ["C0C0C0", "Silver"],
    ["808080", "Gray"],
    ["464646", "Charcoal"],
    ["4B5320", "Army Green"],
    ["228B22", "Forest Green"],
    ["808000", "Olive"],
    ["7FFF00", "Chartreuse"],
    ["BFFF00", "Lime"],
    ["FFD700", "Golden"],
    ["DAA520", "Goldenrod"],
    ["FF7F50", "Coral"],
    ["FA8072", "Salmon"],
    ["FC0FC0", "Hot Pink"],
    ["FF77FF", "Fuchsia"],
    ["CC8899", "Puce"],
    ["E0B0FF", "Mauve"],
    ["B57EDC", "Lavender"],
    ["843179", "Plum"],
    ["4B0082", "Indigo"],
    ["800000", "Maroon"],
    ["DC143C", "Crimson"],
    ["6F4E37", "Coffee"],
    ["FFA500", "Orange"],
    ["FFFF00", "Yellow"]

  ]
}

ntc.init();