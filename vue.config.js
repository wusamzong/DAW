const fs = require('fs');
module.exports = {
  devServer: {
    host: '0.0.0.0',
    public: '61.223.86.174:8080',  //桌電的網路位址

    port: 8080,
    //hot: true,
    //disableHostCheck: true,
    https:{
      key: fs.readFileSync('./VR.key'),
      cert: fs.readFileSync('./VR.crt')
    },
    //proxy: 'http://lara-api.test'
  },
 
   // output built static files to Laravel's public dir.
   // note the "build" script in package.json needs to be modified as well.
   outputDir: '../../../public/assets/app',
 
   publicPath: process.env.NODE_ENV === 'production'
     ? '/assets/app/'
     : '/',
 
   // modify the location of the generated HTML file.
   indexPath: process.env.NODE_ENV === 'production'
     ? '../../../resources/views/app.blade.php'
     : 'index.html'
 }