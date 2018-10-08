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
                if(type==="data_lost"){
                    document.getElementById("data_lost").innerHTML=oAjax.responseText;
                }
                else if(type==="data_pick"){
                    document.getElementById("data_pick").innerHTML=oAjax.responseText;
                }
               /* else if(type==="login"){ }
                else if(type==="register"){ } */
                else { alert("数据类型不存在"); }
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
        loginStation.innerHTML="<a onclick='login()'>请先登录！</a>";
    }else{
        loginStation.innerText=cookies[0]+"，欢迎您！";
    }
    doCookie("show");
}

//判断登陆为 未登录，出现登陆窗口
function login(){
    alert('1');
}

//文档加载完毕执行内容
window.onload = function () {
    selLogin();//验证cookie
    postData("data_lost","Key=getData&getType=lost&pageNumber=1");


};
