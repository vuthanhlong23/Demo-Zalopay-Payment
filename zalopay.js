const axios = require('axios').default; 
const CryptoJS = require('crypto-js'); 
const moment = require('moment'); 
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const exphdbs = require('express-handlebars');
var path = require('path');

const port = 3000
app.set('views', path.join(__dirname, "views"));
app.engine('handlebars', exphdbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');


var items = [{
  "name": "Lược sử thời gian",
  "sku": "001",
  "price": "70000",
  "currency": "vnd",
  "quantity": 1
}, 
{
  "name": "Thuyết vạn vật",
  "sku": "002",
  "price": "10000",
  "currency": "vnd",
  "quantity": 2
},
{
  "name": "Thương mại điện tử",
  "sku": "003",
  "price": "50000",
  "currency": "vnd",
  "quantity": 1
},
{
  "name": "Khởi nghiệp",
  "sku": "004",
  "price": "80",
  "currency": "vnd",
  "quantity": 1
},]

var total = 0;
for(let i = 0 ; i < items.length; i++) {
  total+= parseFloat(items[i].price * items[i].quantity);
}

// APP INFO
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  key3: "eG4r0GcoNtRGbO8",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

const embed_data = {};

const transID = Math.floor(Math.random() * 1000000);
const order = {
  app_id: config.app_id,
  app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
  app_user: "user123",
  app_time: Date.now(), // miliseconds
  item: JSON.stringify(items),
  embed_data: JSON.stringify(embed_data),
  amount: total,
  description: `Vu Thanh Long demo - Payment for the order #${transID}`,
  bank_code: "zalopayapp",
};

// appid|app_trans_id|appuser|amount|apptime|embeddata|item
const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

app.get('/', function(req, res){
  res.render('index.handlebars', {'items':items});
})

axios.post(config.endpoint, null, { params: order })
  .then(res => {
      console.log(res.data);
  })
  .catch(err => console.log(err));

app.post('/pay', function(req, res) {
  res.redirect('https://sbgateway.zalopay.vn/openinapp?order=eyJ6cHRyYW5zdG9rZW4iOiIyMTA4MDQwMDAwMDAwMjAxT3ZlU3JzIiwiYXBwaWQiOjI1NTN9')
}); 

//Callback
app.use(bodyParser.json()); 

app.post('/callback', (req, res) => {
    let result = {};
    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;

        let mac = CryptoJS.HmacSHA256(dataStr, config.key3).toString();
        console.log("mac =", mac);

        // kiểm tra callback hợp lệ (đến từ ZaloPay server)
        if (reqMac !== mac) {
            // callback không hợp lệ
            result.returncode = -1;
            result.returnmessage = "mac not equal";
        }
        else 
        {
            // thanh toán thành công
            // merchant cập nhật trạng thái cho đơn hàng
            let dataJson = JSON.parse(dataStr, config.key3);
            console.log("update order's status = success where apptransid =", dataJson["apptransid"]);

            result.returncode = 1;
            result.returnmessage = "success";
        }
    } 
    catch (ex) 
    {
        result.returncode = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
        result.returnmessage = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})