 var pageNumber=1;
function postData(type,data) {
    var oAjax = null,okMessage;
    //post提交的数据

    //这里进行HTTP请求
    try {
        oAjax = new XMLHttpRequest();
    } catch (e) {
        oAjax = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //post方式打开文件
    oAjax.open('post', 'api_server.aspx?=' + Math.random(), true);
    //post相比get方式提交多了个这个
    oAjax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //post发送数据
    oAjax.send(data);
    oAjax.onreadystatechange = function () {
        //当状态为4的时候，执行以下操作
        if (oAjax.readyState === 4) {
            try {
                //将返回的数据赋值给okMessage
                var okMessage=oAjax.responseText;
                /*
                * 数据返回数据类型：json
                * 数据内容：
                *       code:200/404/500   正常返回数据/数据丢失/服务器出现问题
                *       content：
                *
                *
                * */
                if (type === "data_lost") {
                    //通过解析json数据，获取丢失物品的数据信息，呈现到前端
                    var data = JSON.parse(okMessage);
                    for (var i in data) {
                        document.getElementById("data_lost").innerHTML += "<li class='data_content_box'>" +
                            "                <img class='img_photo' src='" + data[i].imgUrl + "' />" +
                            "                <div class='content_box'>" +
                            "                    <p class='itemTitle'>" + data[i].itemTitle + "</p>" +
                            "                    <p class='itemContectUser'>" + data[i].userName + "</p>" +
                            "                    <textarea class='itemDescribe' readonly='readonly'>" + data[i].itemDescribe + "</textarea>" +
                            "                </div>" +
                            "            </li>";
                    }                    
                }
                else if(type==="data_pick"){
                    //通过解析json数据，获取丢失物品的数据信息，呈现到前端
                    var data = JSON.parse(okMessage);
                    for (var i in data) {
                        document.getElementById("data_pick").innerHTML += "<li class='data_content_box'>" +
                            "                <img class='img_photo' src='" + data[i].imgUrl + "' />" +
                            "                <div class='content_box'>" +
                            "                    <p class='itemTitle'>" + data[i].itemTitle + "</p>" +
                            "                    <p class='itemContectUser'>" + data[i].userName + "</p>" +
                            "                    <textarea class='itemDescribe' readonly='readonly'>" + data[i].itemDescribe + "</textarea>" +
                            "                </div>" +
                            "            </li>";
                    }                    
                }
                else if(type==="login"){

                }
                else if(type==="register"){}
                else if(type==="putData"){
                    alert(okMessage);
                }
                else{}
            } catch (e) {
                okMessage = '你访问的页面出错了';
            }
        }
    };
}
//rsa加密
function rsa(dataStr,public_key){
    var encrypt = new JSEncrypt();
    // 获取公钥
    public_key = encrypt.getPublicKey();
// 获取私钥
    var private_key = encrypt.getPrivateKey();
    encrypt.setPublicKey(public_key);
    var encryptData = encrypt.encrypt(dataStr);//加密后的字符串
    alert(encryptData);
    alert(private_key);
    alert(public_key);
}
function doCookie(type){
    if(type==="create"){
        document.cookie="hy"+"&"+"112233";
    }else if(type==="show"){
        var cookieArry=document.cookie.split("&");
        alert("Name="+cookieArry[0]+"\t\r"+"ID="+cookieArry[1])
    }else{
        alert("mssage:erro");
    }
}

//判断cookie状态，验证登陆状态
function selLogin(){
    const loginStation = document.getElementById("loginStation");
    const cookies = document.cookie.split("&");
    if(cookies[0].concat("uid")){
        loginStation.innerHTML="<a onclick='show_loginBox()'>请先登录！</a>";

    }else{
        loginStation.innerText=cookies[0]+"，欢迎您！";

    }
    doCookie("show");
}

//登陆操作代码
function login(){
    postData("login","Key=login&usrName="+document.getElementById("login_usrName").value+"&passWord="+document.getElementById("login_passWord").value);
}

//出现登陆窗口操作代码
function show_loginBox(){
    document.getElementById("loginBox").style.display="block";
}

function putData(){
    var date=new Date();

    postData("putData", "Key=putData&itemTitle=" + document.getElementById("itemTitle").value + "&itemType=" + document.getElementById("itemType").value + "&Address=" + document.getElementById("Address").value + "&Time=" + document.getElementById("Time").value + "&imgUrl=" + document.getElementById("imgUrl").value + "&putType=" + document.getElementById("putType").value + "&itemDescribe=" + document.getElementById("itemDescribe").value + "&putTime=" + date.toUTCString()+ "&putUser=admin")
}
//文档加载完毕执行内容
window.onload = function () {
    //selLogin();//验证cookie
    alert("尊敬的用户您好：\n\r目前本网站仅支持数据的发布与显示，其它功能将在后面的更新中完善。\n\r因为网站资源有限，暂时不支持图片的上传，请将图片上传到其它公开的图片空间，获取图片的链接填写，感谢您的配合！\n\r 在您发布数据时，请注意遵守中华人民共和国相关法律法规以及道德规范要求，请勿发布非法及恶意的言论。\n\r感谢您的配合！！");
    postData("data_lost","Key=getData&getType=lost&pageNumber=1");
    postData("data_pick","Key=getData&getType=pick&pageNumber=1");
};
