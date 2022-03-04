function displayFields(form,customHTML){

	var mode     = form.getFormMode();
    var state    = getValue("WKNumState");
    var complete = getValue("WKCompletTask");
    var user     = getValue("WKUser");
    var locale   = getValue("WKUserLocale");
    var mobile   = form.getMobile();
	var processo = getValue("WKNumProces");
	var solicitacao = form.getDocumentId();

	
	customHTML.append("<script>");
	customHTML.append("		function getFormMode(){ return '" + mode + "'};");
	customHTML.append("		function getMobile(){ return '" + mobile + "'};");
	customHTML.append("		function getWKNumState(){ return '" + state + "'};");
	customHTML.append("		function getWKUser(){ return '" + user + "'};");
	customHTML.append("		function getWKNumProces(){ return '" + processo + "'};");
	customHTML.append("		function getWKUserLocale(){ return '" + locale + "'};");
	customHTML.append("		function getWKCardId(){ return '" + solicitacao + "'};");
	customHTML.append("</script>");
}