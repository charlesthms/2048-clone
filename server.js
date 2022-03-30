const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const ip = require('ip');

const initial_path = path.join(__dirname + '/');
const PORT = 4000 || process.env.PORT;
app.use(express.static(initial_path + '/client'));

router.get('/',function(req,res){
  res.status(200).sendFile(initial_path + 'client/index.html');
});

app.use('/', router);
app.listen(PORT, () => {
  console.log("\x1b[35m" ,`Serveur lancé:\n`);
  console.log("\x1b[32m", `   - http://localhost:${PORT}/\n    - http://${ip.address()}:${PORT}/`);
});