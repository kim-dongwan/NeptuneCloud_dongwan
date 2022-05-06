var TradeModel = require("./trade-model");

module.exports.CreateTrade = async function(req, res){
	var result =  await TradeModel.Create(req);  
	 
	if (result.output.ReturnVal===401)
	{
		strMessage ="수량이 존재하지않습니다"; 
	}
	else if (result.output.ReturnVal===402)
	{
		strMessage ="거래가능한 재고가 부족합니다."; 
	}
	else if (result.output.ReturnVal===408)
	{
		strMessage ="거래가 불가능한 물품입니다."; 
	}
	else if (result.output.ReturnVal===409)
	{
		strMessage ="최소거래금액보다 적은금액으로 거래를 요청하셨습니다."; 
	}
	else if (result.output.ReturnVal===500)
	{
		strMessage ="잘못된 경로로 접근하셨습니다.(에러발생)"; 
	}
	else if (result.output.ReturnVal===200)
	{
		strMessage = "등록이 완료되었습니다."
	}
	else
	{
		strMessage ="에러발생"
	}
	res.json(result.output.ReturnVal,{"output":{"ReturnVal":result.output.ReturnVal},"returnMSG":strMessage});
}


module.exports.Search = async function(req, res){
	var result =  await TradeModel.Search(req);  
	res.json(result);
}


module.exports.View = async function(req, res){
	var result =  await TradeModel.View(req);  
	res.json(result);
}


module.exports.TradeJoin = async function(req, res){
	var result =  await TradeModel.TradeJoin(req);  
	
	if (result.output.ReturnVal===401)
	{
		strMessage ="자신의 경매에 참여는 불가능합니다"; 
	}
	else if (result.output.ReturnVal===402)
	{
		strMessage ="이미 종료되거나 정산중인 경매입니다."; 
	}
	else if (result.output.ReturnVal===403)
	{
		strMessage ="현재 경매참여가능한 금액보다 적거나 같은금액으로는 참여가 불가능합니다."; 
	}
	else if (result.output.ReturnVal===406)
	{
		strMessage ="참여금액이 부족합니다."; 
	}
	else if (result.output.ReturnVal===407)
	{
		strMessage ="이미 해당경매에 참여하였습니다.참여금액 변경으로 진행해주시기 바랍니다"; 
	}
	else if (result.output.ReturnVal===500 ||result.output.ReturnVal===501 ||result.output.ReturnVal===502)
	{
		strMessage ="잘못된 경로로 접근하셨습니다.(에러발생)"; 
	}
	else if (result.output.ReturnVal===200)
	{
		strMessage = "등록이 완료되었습니다."
	}
	else
	{
		strMessage ="에러발생"
	}
	res.json(result.output.ReturnVal,{"output":{"ReturnVal":result.output.ReturnVal},"returnMSG":strMessage});
}



module.exports.TradeUpdate = async function(req, res){
	var result =  await TradeModel.TradeUpdate(req);  
	
	if (result.output.ReturnVal===401)
		{
			strMessage ="자신의 경매에 참여는 불가능합니다"; 
		}
		else if (result.output.ReturnVal===402)
		{
			strMessage ="이미 종료되거나 정산중인 경매입니다."; 
		}
		else if (result.output.ReturnVal===403)
		{
			strMessage ="현재 경매참여가능한 금액보다 적거나 같은금액으로는 참여가 불가능합니다."; 
		}
		else if (result.output.ReturnVal===406)
		{
			strMessage ="참여금액이 부족합니다."; 
		}
		else if (result.output.ReturnVal===407)
		{
			strMessage ="참여중인 경매가 아닙니다.경매 참여신청으로 진행해주시기 바랍니다"; 
		}
		else if (result.output.ReturnVal===408)
		{
			strMessage ="이전에 신청한금액보다 적은금액으로는 신청이 불가능합니다"; 
		}
		else if (result.output.ReturnVal===500 ||result.output.ReturnVal===501 ||result.output.ReturnVal===502)
		{
			strMessage ="잘못된 경로로 접근하셨습니다.(에러발생)"; 
		}
		else
		{
			if (req.body.strType==="update")
			{
				strMessage = "경매금액을 높여서 재참여 완료하였습니다.";
			}
			else if (req.body.strType==="cancel")
			{
				strMessage = "경매참여 취소가 완료되었습니다.";
			}
		}
		res.json(result.output.ReturnVal,{"output":{"ReturnVal":result.output.ReturnVal},"returnMSG":strMessage});
}
