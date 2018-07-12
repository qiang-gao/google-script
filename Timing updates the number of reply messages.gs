// jdbc connect database
var address = '';
var user = '';
var userPwd = '';
var db = '';
//var dbUrl = 'jdbc:mysql://' + address + '/' + db;
var dbUrl = 'jdbc:mysql://' + address + '/' + db + '?useUnicode=true&characterEncoding=GB2312';


/**
 * updateResponses
 */
function updateResponses() {
  var list = getGoogleFormsList();  
  var conn = Jdbc.getConnection(dbUrl, user, userPwd);
  conn.setAutoCommit(false);
  var tmp_responses_number,tmp_form_name,tmp_form_id;
  var stmt = conn.prepareStatement('UPDATE hl_form_builder set responses_number = ? , form_name = ?  where form_id = ?');
  for (var i = 0; i < list.length; i++) {
    tmp_responses_number = list[i][0];
    tmp_form_name = list[i][1];
    tmp_form_id = list[i][2];
    stmt.setString(1, tmp_responses_number);
    stmt.setString(2, tmp_form_name);
    stmt.setString(3, tmp_form_id);
    stmt.addBatch();
  }
  var batch = stmt.executeBatch();
  conn.commit();
  conn.close();
}

/**
 * 获取当前用户下的所有表单信息
 */
function getGoogleFormsList() {
  var files = DriveApp.getFilesByType(MimeType.GOOGLE_FORMS);
  var i = 0;
  var list = [];
  
  //循环当前用户下的所有表单
  while (files.hasNext()){
    var file = files.next();
    var row = [];
    var form = FormApp.openById(file.getId());
    row[0] = get_responses(file.getId());
    row[1] = file.getName();
    row[2] = file.getId();
    list[i] = row;
    i++;
  }
 
   return list;
}

/**
 * 返回每个表单的回复个数
 */
function get_responses(id){
  // Open a form by ID and log the responses to each question.
  var form = FormApp.openById(id);
  var formResponses = form.getResponses();
  return formResponses.length;
}
