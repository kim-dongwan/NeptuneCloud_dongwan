var express = require('express');
var router = express.Router();
var Naver_request = require('request');
var jwt      = require('jsonwebtoken');  //토큰확인
var bodyParser = require('body-parser');	//파서


const {sql,Pool} = new require('../config/db');


/**
 * @swagger
 *  /Trade/CreateTrade:
 *    post:
 *      tags: [Trade]
 *      summary: 경매장 거래생성
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: "headder"
 *          name: "nusernumber"
 *          description: "유저키값"
 *          required: true
 *          schema:
 *              type: string
 *        - in: "headder"
 *          name: "logintoken"
 *          description: "로그인세션 보안키값"
 *          required: true
 *          schema:
 *              type: string
 *        - in: "body"
 *          description: "아이템판매를 위해서 경매장에 경매거래생성"
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  nGameItem:
 *                      type: number
 *                  nItemCnt:
 *                      type: number
 *                  nTradePrice:
 *                      type: number
 *      responses:
 *       200:
 *        description: 거래 정상생성완료
 *       401:
 *        description: 유저의 아이템수량이 0개
 *       402:
 *        description: 유저의 아이템수량이 신청수량보다 적어서 신청불가능
 *       408:
 *        description: 경매장 거래신청이 불가능한 물품
 *       409:
 *        description: 경매장등록시 최소필요금액보다 적은금액으로 신청 불가(불법거래막기위함)
 *       500:
 *        description: 에러발생
 */

//경매장 생성
 exports.Create = async (req) =>{
	 try{
		var PoolConn = await Pool;
		var bodyData = req.body;
		
		var nUserNumber = req.headers["nusernumber"];
		var strMessage ="";
		var result = await PoolConn.request()
		.input('PkPlayUser',sql.Int,nUserNumber)
		.input('PKGameItem',sql.Int,bodyData.nGameItem)
		.input('nItemCnt',sql.Int,bodyData.nItemCnt)
		.input('nTradePrice',sql.Int,bodyData.nTradePrice)
		.output('ReturnVal',0)
		.execute('StudyDB.dbo.PROC_TradeCreate');

		return result;
	
	}catch(err){
		return err;
	}
}

/**
 * @swagger
 * /Trade/Search?QueryString={QueryString}...:
 *  get:
 *    summary: "경매장 등록물품 조회 Query 방식"
 *    description: "필요한 조건에 따라서 경매장 물품을 검색한다"
 *    tags: [Trade]
 *    parameters:
 *      - in: query
 *        name: strItemName
 *        required: false
 *        description: 아이템명
 *        schema:
 *          type: string
 *      - in: query
 *        name: nItemType
 *        required: false
 *        description: 아이템타입(투구,갑옷,무기등등)
 *        schema:
 *          type: number
 *      - in: query
 *        name: nPower
 *        required: false
 *        description: 공격력
 *        schema:
 *          type: number
 *      - in: query
 *        name: nDefense
 *        required: false
 *        description: 방어력
 *        schema:
 *          type: number
 *      - in: query
 *        name: nStr
 *        required: false
 *        description: 힘
 *        schema:
 *          type: number
 *      - in: query
 *        name: nDex
 *        required: false
 *        description: 민첩
 *        schema:
 *          type: number
 *      - in: query
 *        name: nInt
 *        required: false
 *        description: 지력
 *        schema:
 *          type: number
 *      - in: query
 *        name: nEndSuccessYN
 *        required: false
 *        description: 경매상태가 어떤물품인지 여부(경매진행중,경매완료등..)
 *        schema:
 *          type: number
 *    responses:
 *       200:
 *        description: 검색완료(List)
 *       500:
 *        description: 오류발생
 */
//경매장 제품검색
exports.Search = async (req) =>{
	try{
		var PoolConn = await Pool;
		var SearchData = req.query;
		var result = await PoolConn.request()
		.input('strItemName',sql.VarChar,SearchData.strItemName)
		.input('PkItemType',sql.Int,SearchData.nItemType)
		.input('nPower',sql.Int,SearchData.nPower)
		.input('nDefense',sql.Int,SearchData.nDefense)
		.input('nStr',sql.Int,SearchData.nStr)
		.input('nDex',sql.Int,SearchData.nDex)	
		.input('nInt',sql.Int,SearchData.nInt)	
		.input('nEndSuccessYN',sql.Int,SearchData.nEndSuccessYN)	
		.execute('StudyDB.dbo.PROC_TradeSearch');

		return result;
	
	}catch(err){
		return err;
	}
}

/**
 * @swagger
 * /Trade/{ItemTrade}/View:
 *  get:
 *    summary: "경매장물품 상세보기"
 *    description: "경매진행중또는 완료된 물품의 정확한 정보를 확인한다"
 *    tags: [Trade]
 *    parameters:
 *      - in: headder
 *        name: nUserNumber
 *        required: true
 *        description: 유저키값
 *        schema:
 *          type: string
 *      - in: headder
 *        name: logintoken
 *        required: true
 *        description: 로그인세션 보안키값
 *        schema:
 *          type: string
 *      - in: parameter
 *        name: ItemTrade
 *        required: true
 *        description: 경매장물품의 키값
 *        schema:
 *          type: string
 *    responses:
 *       200:
 *        description: 조회완료(View)
 *       500:
 *        description: 오류발생
 */

/*경매 정보보기*/
exports.View = async (req) =>{
	try{
		var PoolConn = await Pool;
		var ItemTrade = req.params.ItemTrade;

		var strSQL = 
			"select "
			+"	Case "
			+"	when A.nMaxPrice=0 or A.nMaxPrice is null then A.nTradeMinPrice "
			+"	else A.nMaxPrice "
			+" end  as nMaxPrice"
			+" ,A.nItemCnt "
			+" ,Case 	 "
			+"	when nEndSuccessYN = 0 and strEndDate>getdate()  then '거래중('+Convert(varchar(16),strEndDate,120)+'까지)' "
			+"	when nEndSuccessYN = 0 and strEndDate <=getdate()  then '집계중' "
			+"	when nEndSuccessYN = 1 then '거래완료' "
			+"	when nEndSuccessYN = 2 then '거래실패' "
			+" end as strEndSuccessYN "
			+" ,B.* from StudyDB.dbo.ItemTrade A INNER JOIN  "
			+" StudyDB.dbo.GameItem B on A.PKGameItem=B.PKGameItem "
			+" where A.PKItemTrade=@PKItemTrade"

		var result = await PoolConn.request()
		.input('PKItemTrade',sql.Int,ItemTrade)
		.query(strSQL);

		return result;
	
	}catch(err){
		return err;
	}
}

/**
 * @swagger
 *  /Trade/{ItemTrade}/TradeJoin:
 *    post:
 *      tags: [Trade]
 *      summary: 경매장 거래참여
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: "headder"
 *          name: "nusernumber"
 *          description: "유저키값"
 *          required: true
 *          schema:
 *              type: string
 *        - in: "headder"
 *          name: "logintoken"
 *          description: "로그인세션 보안키값"
 *          required: true
 *          schema:
 *              type: string
 *        - in: "parameter"
 *          name: "ItemTrade"
 *          description: "거래물품키값"
 *          required: true
 *          schema:
 *              type: string
 *        - in: "body"
 *          description: "아이템판매를 위해서 경매장에 경매거래생성"
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  nReqeustPrice:
 *                      type: number
 *      responses:
 *       200:
 *        description: 경매장 참여완료
 *       401:
 *        description: 자신이 등록한경매에는 참여 불가능
 *       402:
 *        description: 이미 종료되거나 정산중인 경매
 *       403:
 *        description: 현재 경매참여가능한 금액보다 적거나 같은금액으로는 참여가 불가능
 *       406:
 *        description: 보유한금액이 참여신청한 금액보다 적음
 *       407:
 *        description: 이미 경매에 참여. 경매금액 변경API 사용
 *       500,501,502:
 *        description: 에러발생
 */

//경매장 참여
 exports.TradeJoin = async (req) =>{
	 try{
		var PoolConn = await Pool;
		var bodyData = req.body;
		var ItemTrade = req.params.ItemTrade;
		
		var nUserNumber = req.headers["nusernumber"];
		var strMessage ="";

		var result = await PoolConn.request()
		.input('PkPlayUser',sql.Int,nUserNumber)
		.input('PKItemTrade',sql.Int,ItemTrade)
		.input('nReqeustPrice',sql.Int,bodyData.nReqeustPrice)
		.output('ReturnVal',0)
		.execute('StudyDB.dbo.PROC_TradeJoin');

		return result
	
	}catch(err){
		return err
	}
}
/**
 * @swagger
 *  /Trade/{ItemTrade}/TradeJoin:
 *    patch:
 *      tags: [Trade]
 *      summary: 경매장 취소또는 금액변경
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: "headder"
 *          name: "nusernumber"
 *          description: "유저키값"
 *          required: true
 *          schema:
 *              type: string
 *        - in: "headder"
 *          name: "logintoken"
 *          description: "로그인세션 보안키값"
 *          required: true
 *          schema:
 *              type: string
 *        - in: "parameter"
 *          name: "ItemTrade"
 *          description: "거래물품키값"
 *          required: true
 *          schema:
 *              type: string
 *        - in: "body"
 *          description: "아이템판매를 위해서 경매장에 경매거래생성"
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  nReqeustPrice:
 *                      type: number
 *                  strType:
 *                      type: string
 *      responses:
 *       200:
 *        description: 경매장 참여완료
 *       401:
 *        description: 자신이 등록한경매에는 참여 불가능
 *       402:
 *        description: 이미 종료되거나 정산중인 경매
 *       403:
 *        description: 현재 경매참여가능한 금액보다 적거나 같은금액으로는 참여가 불가능
 *       406:
 *        description: 보유한금액이 참여신청한 금액보다 적음
 *       407:
 *        description: 참여중인경매가 아닙. 경매신청API 사용
 *       408:
 *        description: 이전신청금액보다 현재 신청금액이 적음(strType이 update일때만)
 *       500,501,502:
 *        description: 에러발생
 */

//경매장 취소또는 금액변경

exports.TradeUpdate = async (req) =>{
	 try{
		var PoolConn = await Pool;
		var bodyData = req.body;
		var ItemTrade = req.params.ItemTrade;
		
		var nUserNumber = req.headers["nusernumber"];
		var strMessage ="";

		var result = await PoolConn.request()
		.input('PkPlayUser',sql.Int,nUserNumber)
		.input('PKItemTrade',sql.Int,ItemTrade)
		.input('nReqeustPrice',sql.Int,bodyData.nReqeustPrice)
		.input('strType',sql.VarChar,bodyData.strType)
		.output('ReturnVal',0)
		.execute('StudyDB.dbo.PROC_TradeUPDATE');	

		return result
	}catch(err){
		return err
	}
}
