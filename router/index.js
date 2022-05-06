var express = require('express');
var router = express.Router();
var Naver_request = require('request');
var jwt      = require('jsonwebtoken');  //토큰확인
var bodyParser = require('body-parser');	//파서


const member = require("../member/member-controller")
router.post("/member/Login", member.Loginpost)

//거례관련
const trade = require("../trade/trade-controller")
router.post("/trade/CreateTrade", trade.CreateTrade)
router.get("/trade/Search", trade.Search)
router.get("/trade/:ItemTrade/View", trade.View)
router.post("/trade/:ItemTrade/TradeJoin", trade.TradeJoin)
router.patch("/trade/:ItemTrade/TradeJoin", trade.TradeUpdate)

module.exports = router;