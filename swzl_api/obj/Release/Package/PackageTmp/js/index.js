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
                    if(okMessage==="404"){
                        alert("错误代码：0x48\n用户名与密码不匹配！");
                    }else if(okMessage==="500"){
                        alert("错误代码：0x50\n登陆服务器出现错误，请联系网站管理员admin@1233z.cn");
                    }else{
                        alert("登陆成功！");
                        doCookie("login",okMessage);
                        loginBox("clear");
                        selLogin();
                    }
                }
                else if(type==="register"){
                    if(okMessage==="201"){
                        alert("错误代码：0x46\n 用户名已存在");
                    }else if(okMessage==="500"){
                        alert("错误代码：0x47\n注册服务器出现错误，请联系网站管理员admin@1233z.cn ");
                    }else{
                        alert("注册成功！即将跳转到登陆界面");
                        loginBox("login");
                    }
                }
                else if(type==="putData"){
                    if(okMessage==="200"){
                        alert("数据上传成功！");
                    }else{
                        alert("数据上传服务器出现错误，请等待。。。");
                    }
                }

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
function doCookie(type,data){
    document.cookie = "seted";
    if (type === "login") {
        var jsonData = JSON.parse(data);
        for (var k = 0; k < jsonData.length; k++){
            for (var j in jsonData[k]) {
                document.cookie += "&"+ jsonData[k][j];
            }
        }
        //document.cookie = data;
    }else if(type==="update"){

    }else if(type==="clear"){

    }else{
        alert("mssage:erro");
    }
}
//判断cookie状态，验证登陆状态
function selLogin(){
    const loginStation = document.getElementById("loginStation");
    const cookies = document.cookie.split("&");
    if (cookies.indexOf("seted")<0) {
        loginStation.innerHTML="<a onclick='loginBox(\"login\")'>请先登录！</a>";
    }else{
        loginStation.innerText=cookies[1]+"，欢迎您！";

    }
}

//登陆操作代码
function login(){
    var message=judged("login");
    if(message==="ok"){
        postData("login","Key=login&usrName="+document.getElementById("login_usrName").value+"&usrPassword="+document.getElementById("login_passWord").value);
    }else if(message==="err"){
        alert("错误代码：0x49\n您的登陆数据不符合规范！请重试");
    }
}
function register() {
    var message=judged("register");
    if(message==="ok"){
        postData("register","Key=register&usrName="+document.getElementById("register_usrName").value+"&usrPassword="+document.getElementById("register_passWord").value+"&eMail="+document.getElementById("register_eMail").value);
    }else {
        alert("错误代码：0x47\n您的数据长度不规范，请重试");
    }
}
//出现登陆窗口操作代码
function loginBox(type){
    if(type==="login"){
        document.getElementById("loginBox").style.display="block";
        document.getElementById("registerBox").style.display="none";
    }else if(type==="register"){
        document.getElementById("registerBox").style.display="block";
        document.getElementById("loginBox").style.display="none";
    }
    else{
        document.getElementById("loginBox").style.display="none";
        document.getElementById("registerBox").style.display="none";
    }
}

//判断数据是否符合规范
function judged(type) {
    if(type==="putData"){
        if(document.getElementById("itemTitle").value!==""&&document.getElementById("itemType").value!==""&&document.getElementById("Time").value!==""&&document.getElementById("Address").value!==""&&document.getElementById("putType").value!==""&&document.getElementById("contact_user").value!==""){
            return "ok";
        }else{
            return "err";
        }
    }else if(type==="login"){
        if(document.getElementById("login_usrName").value!=="" && document.getElementById("login_passWord").value.length>=6 && document.getElementById("login_usrName").value.length>=6){
            return "ok";
        }else{
            return "err"
        }
    }else if(type==="register"){
        if(document.getElementById("register_usrName").value!==""&&document.getElementById("register_passWord").value!==""&&document.getElementById("register_confirm_passWord").value!==""&&document.getElementById("register_eMail").value!==""&&document.getElementById("register_passWord").value===document.getElementById("register_confirm_passWord").value&&document.getElementById("register_usrName").value.length>=6&&document.getElementById("register_passWord").value.length>=6){
            return "ok";
        }else {
            return "err"
        }
    }else{
        return "err";
    }
}
function putData(){
    var judge=judged("putData");
    if(judge==="ok"){
        var date=new Date();
        postData("putData", "Key=putData&itemTitle=" + document.getElementById("itemTitle").value + "&itemType=" + document.getElementById("itemType").value + "&Address=" + document.getElementById("Address").value + "&Time=" + document.getElementById("Time").value + "&imgUrl=" + document.getElementById("imgUrl").value + "&putType=" + document.getElementById("putType").value + "&itemDescribe=" + document.getElementById("itemDescribe").value + "&putTime=" + date.toUTCString()+ "&putUser=联系方式："+document.getElementById("contact_user".value))
    }else{
        alert("标记为*号的内容为必填选项，请填写后再试！");
    }
}
//文档加载完毕执行内容
window.onload = function () {
    selLogin();//验证cookie
    alert("尊敬的用户您好：\n\r目前本网站仅支持数据的发布与显示，其它功能将在后面的更新中完善。\n\r因为网站资源有限，暂时不支持图片的上传，请将图片上传到其它公开的图片空间，获取图片的链接填写，感谢您的配合！\n\r 在您发布数据时，请注意遵守中华人民共和国相关法律法规以及道德规范要求，请勿发布非法及恶意的言论。\n\r感谢您的配合！！");
    postData("data_lost","Key=getData&getType=lost&pageNumber=1");
    postData("data_pick","Key=getData&getType=pick&pageNumber=1");
};
