/**
 * create google form builder
 * data = ['form_name'=>'','property_id'=>'','properties_live_id'=>'']
 * return ['form_name'=>'','property_id'=>'','properties_live_id'=>'','publish_url'=>'','edit_url'=>'','form_id'=>'']
 */
function create_form_builder(data) {
  
  //var form_name = 'test 123'; 
  var form_name = data.form_name;
    
  // Create and open a form.
  var newForm = FormApp.create(form_name);
  
  // Sets which class of users can access the Folder and what permissions those users are granted, besides any individual users who have been explicitly given access.
  var form_id = newForm.getId();
  var file = DriveApp.getFileById(form_id);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
  
  // return data
  data.publish_url = newForm.getPublishedUrl();
  data.edit_url = newForm.getEditUrl();
  data.form_id = form_id;
  console.log(data);
  return data;
  
}


/**
 * delete google form builder by form id 
 */
function delete_form_builder(data){
  //var formID = '1--FkK5JhaV2HsQ2Cl8uQ-dQtYqy2yQL_Pag-FU-KsBk';
  var formID = data.get_form_id;
  var formName = DriveApp.getFileById(formID).setTrashed(true);
  return data;
}