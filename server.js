var express = require('express');	//익스프레스 모듈 등록
var app = express();
var bodyParser = require('body-parser');	//파서
var request = require('request');
var jwt      = require('jsonwebtoken');  //토큰확인
var schedule = require('node-schedule')
var JWT_SECRET = "NeptuneCloud"

var server = app.listen(3000, function(req,res){
	console.log("Express server has started on port 3000");	//포트 3000으로 서버 실행함
});
 

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true})); //express 4.0 부터는 이렇게 써야 한다고함  안그러면 오류발생!


var middle_token = function (req, res, next) {
	if (req.url.toLowerCase().includes('trade')==true)
	{
		var bearerToken = req.headers["logintoken"];
		var nUserNumber = req.headers["nusernumber"];
		

		try {
			var tokenJson = jwt.verify(bearerToken,JWT_SECRET);
			var timestamp = new Date().getTime();

			if (nUserNumber != tokenJson.nUserNumber)
			{
				res.json(400,{"errCode": 400, "errMessage": "정상적으로 발급된 토큰이아닙니다."});
			}
			else if (timestamp > tokenJson.exp*1000)
			{
				res.json(401,{"errCode": 401, "errMessage": "로그인이 만료되었습니다. 다시 로그인후 사용해주시기 바랍니다"});
			}
			else
			{
				next();
			}
			
		} catch(err) {
			res.json(503,{"errCode": 503, "errMessage": "토큰이 올바르지  않습니다."});
			return;
		}
	}
	else
	{
		next();
	}
  
};
app.use(middle_token);

//로그인,회원가입등등 회원정보 관련된 부분
var Login = require('./router/');
app.use('/',Login);

const { swaggerUi, specs } = require("./swagger/swagger")
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))


/*1분마다 경매물품 정산을 위해서 처리*/
const {sql,Pool} = new require('./config/db');
var job = schedule.scheduleJob('0 * * * * *', async function(){
	var mNow = new Date();

	var PoolConn = await Pool;


	var result = await PoolConn.request()
		.execute('StudyDB.dbo.PROC_TradeCalculate');
});


