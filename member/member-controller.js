var memberModel = require("./member-model");

module.exports.Loginpost = async function(req, res){
	 var result =  await memberModel.Login(req);  
	 
	 var errMessage = "";
	if (result.output.ReturnVal===400)
	{
		errMessage ="ID,PW inconsistency!"; //계정정보틀림
	}
	else if (result.output.ReturnVal===401)
	{
		errMessage ="inactive member"; //휴면계정
	}
	else if (result.output.ReturnVal===402)
	{
		errMessage ="secession member"; //탈퇴계정
	}

	if (errMessage!="")
	{
		res.json(result.output.ReturnVal,{"output":{"ReturnVal":result.output.ReturnVal},"returnMSG":errMessage});
	}
	else
	{
		res.json(result.output.ReturnVal,result);
	}
	
}
