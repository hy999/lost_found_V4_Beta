using System;
using System.Web.Configuration;
using System.Data;
using System.Data.SqlClient;
using Newtonsoft.Json; 

namespace swzl_api
{
    public partial class api_server : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            SqlConnection connection= new SqlConnection(WebConfigurationManager.ConnectionStrings["sql_connection"].ToString());
            connection.Open();
            string sql="";
            string Key = Request.Form["Key"].ToString();
            //key==getData  获取index.html的丢失、拾取数据
            if (Key == "getData")
            {
                // getType 是数据类型 值有：lost/pick
                string getType = Request.Form["getType"].ToString();
                //pageNumber 是index.html的丢失和拾取数据的页码数
                string pageNumber = Request.Form["pageNumber"].ToString();
                int number = int.Parse(pageNumber) * 10;
                /**************************/
                //此处写获取数据的代码并返回json数据
                if (getType == "lost")
                {
                    //获取丢失数据sql语句
                    sql = "select Top "+number+" * from [lostTable]where [itemStatution]='L0' order by [id] desc  ";
                }
                else if (getType == "pick")
                {
                    //获取拾取物品信息的sql语句
                    sql = "select Top "+number+"* from [pickTable] where [itemStatution]='P0' order by [id] desc";
                }
                SqlCommand cmd = new SqlCommand(sql, connection);
                SqlDataReader reader = cmd.ExecuteReader();
                DataTable dataTable = new DataTable();
                dataTable.Load(reader);
                reader.Close();
                connection.Close();
                if (dataTable.Rows.Count <= int.Parse(Request["pageNumber"].ToString()) * 10 - 10)
                {
                    dataTable.Clear();
                }
                else
                {
                    for (int i = 0; i < (int.Parse(Request["pageNumber"].ToString()) - 1) * 10; i++)
                    {
                            dataTable.Rows.RemoveAt(0);
                     }

                }
                Response.Write(JsonConvert.SerializeObject(dataTable));
                /**************************/
            }
            //key==putData 上传信息
            else if (Key=="putData") {

                // itemName  物品名称  itemType 物品类型
                // pickTime/lostTime 拾取/丢失时间
                // pickAddress/lostAddress 拾取/丢失地点
                // imgUrl 图片地址
                // putType 数据上传的类型 值为：lost/pick
                // itemDescribe  物品描述
                // putTime 数据提交时间
                // putUser 数据提交用户
                //putIP 数据提交ip地址
                string itemTitle = Request["itemTitle"].ToString();
                string itemType = Request["itemType"].ToString();
                string Address = Request["Address"].ToString();
                string Time = Request["Time"].ToString();
                string imgUrl = Request["imgUrl"].ToString();
                string putType = Request["putType"].ToString();
                string itemDescribe = Request["itemDescribe"].ToString();
                string putTime = Request["putTime"].ToString();
                string putUser = Request["putUser"].ToString();
               // string putIP = Request["putIP"].ToString();
                //判断上传类型
                if (putType == "lost") {
                    sql = "insert into [lostTable] ([userName],[itemTitle],[imgUrl],[itemDescribe],[lostAddr],[lostTime],[itemStatution],[putTime]) values('"+putUser+"','"+itemTitle+"','"+imgUrl+"','"+itemDescribe+"','"+Address+"','"+Time+"','L0','"+putTime+"')";
                    SqlCommand cmd = new SqlCommand(sql, connection);
                    cmd.ExecuteNonQuery();
                    connection.Close();
                    Response.Write("200");
                }
                else if (putType == "pick") {
                    sql = "insert into [pickTable] ([userName],[itemTitle],[imgUrl],[itemDescribe],[pickAddr],[pickTime],[itemStatution],[putTime]) values('" + putUser + "','" + itemTitle + "','" + imgUrl + "','" + itemDescribe + "','" + Address + "','" + Time + "','P0','" + putTime + "')";
                    SqlCommand cmd = new SqlCommand(sql, connection);
                    cmd.ExecuteNonQuery();
                    connection.Close();
                    Response.Write("200");
                }
                else { Response.Write("404");}
            }
            //key==login 登陆用户，验证信息
            else if (Key == "login") {
                //usrName 用户名  usrPassword  密码
                string usrName = Request.Form["usrName"].ToString();
                string usrPassword = Request.Form["usrPassword"].ToString();
                string lastLoginTime = DateTime.Now.ToString();
                Response.Write(lastLoginTime);
                /**************************/
                /*此处写验证数据的代码并返回json数据
                                            用户名：
                                            code：
                                            手机号：
                                            Email：
                                            Addr：
                                            Job：
                                            注册时间：
                                            上一次登陆时间
                                            上一次登陆ip及地点(暂定)
                */
                /**************************/
            }
        }
    }
}