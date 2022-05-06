var express = require('express');
var router = express.Router();
var Naver_request = require('request');
var jwt      = require('jsonwebtoken');  //토큰확인
var bodyParser = require('body-parser');	//파서

const {sql,Pool} = new require('../config/db');
const JWT_SECRET = "NeptuneCloud"

/**
 * @swagger
 *  /member/Login:
 *    post:
 *      tags: [Member]
 *      summary: 계정로그인
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: "body"
 *          description: "로그인진행한 계정정보및 환경정보 입력"
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  strUserID:
 *                      type: string
 *                  strUserPWD:
 *                      type: string
 *                  strLoginDevice:
 *                      type: string
 *                  strLoginOS:
 *                      type: string
 *                  strLoginBrowser:
 *                      type: string
 *      responses:
 *       200:
 *        description: 정상로그인완료
 *       400:
 *        description: 계정정보 불일치
 *       401:
 *        description: 휴면상태인 게정
 *       402:
 *        description: 삭제된 계정
 *       500:
 *        description: 에러발생
 */

 exports.Login = async (req) =>{
	 try{
		var PoolConn = await Pool;
		var bodyData = req.body;

		var result = await PoolConn.request()
		.input('strUserID',sql.VarChar,bodyData.strUserID)
		.input('strUserPWD',sql.VarChar,bodyData.strUserPWD)
		.input('strLoginDevice',sql.VarChar,bodyData.strLoginDevice)
		.input('strLoginOS',sql.VarChar,bodyData.strLoginOS)
		.input('strLoginBrowser',sql.VarChar,bodyData.strLoginBrowser)
		.output('ReturnVal',0)
		.execute('StudyDB.dbo.PROC_UserLogin');
		
		//정상인경우 토큰값 추가
		if (result.output.ReturnVal==200)
		{
			//토큰정보를 추가해서 값에 추가해주가자
			var userInfo = {"nUserNumber":result.recordset[0].nUserNumber}
			var options = {expiresIn: '1h', issuer: 'Login'};
			const token = jwt.sign(userInfo, JWT_SECRET, options);
			result.recordset[0].token = token
		}
		return result;
	
	}catch(err){
		return err;
	}
}
