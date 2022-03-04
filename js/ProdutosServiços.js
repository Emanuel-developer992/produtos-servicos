// Window para onload da página 

window.onload = function() {

    idSeq();
    groups();
    revisaoDate();
    maskMoney();
    maskPercent();

    usuario('solicitante');

    motherSon(); 
};

// API - CEP AUTOMÁTICO

//#region API

$("#cep").blur(function(blur) {
    
    const paisAuto = "Brasil";
    const cadastroCEP = document.getElementById("pais");

    cadastroCEP.value = paisAuto;

    $.getJSON("//viacep.com.br/ws/"+ $("#cep").val() +"/json/", function(dados){  
        $("#endereco").val(dados.logradouro);
        $("#bairro").val(dados.bairro);
        $("#estado").val(dados.localidade);2
    })
});

//#endregion


// GERADOR DE ID

//#region onload
function idSeq() {

    var dsCadastro = DatasetFactory.getDataset("DSFormulariodeCadastrodeProdutoseServicos", null, null, null);

    var linha = dsCadastro.values.length;

    var inputPS = document.getElementById("codP");
    
    inputPS.value = "PS-" + (linha + 1);
};

//#endregion

// TABELAS
//#region Funtion

var idClick = 0;
var ClickAdd1 = 0;
var ClickAdd2 = 0;
var ClickAdd3 = 0;
var idAll;
var idOAll;



//Produtos e Serviços
var clickItem = 0;

function pushItem() {

    clickItem++;

    // -------------- Add Coluna ----------------------------------------------
    wdkAddChild('tb_subitem');

    // -------------- Add Estudo Automático -----------------------------------
    var estudo = $("#estudoPS").val();
    $("#tb_responsavel___" + clickItem).val(estudo);

     // -------------- Número de Linhas + Número do Subitem -------------------
    var rowCount = $('#tb_subitem tr').length;
    var n = rowCount - 2;
    $("#tb_n___" + clickItem).val(n)

    // --------------- Código do Documento ------------------------------------
    var cod_doc = $("#codP").val();
    $("#tb_doc___" + clickItem).val(cod_doc);

    // --------------- Evento de Excluir Linha --------------------------------
    $(".excluir").bind("click", Excluir);

}

//#endregion

function Excluir(){

    var par = $(this).parent().parent(); //tr

    par.remove();

    allValues();
};




//REVISÃO DE DOCUMENTO E DATA
function revisaoDate() {

    //Tratamento de data
    var data = new Date();

    var nProcesso = getWKNumState();
    
    var dia = data.getDate();     // 1-31
    var mes = data.getMonth();    // 0-11 (zero=janeiro)
    var ano = data.getFullYear(); // 4 dígitos

    if ((mes + 1) <= 9) {

        if (dia <= 9) {
            var date_comp = ('0' + dia + "/" + '0' + (mes + 1) + "/" + ano);
        }

        else {
            var date_comp = (dia + "/" + '0' + (mes + 1) + "/" + ano);
        }
    }

    else if (dia <= 9) {
        var date_comp = ('0' + dia + "/" + (mes + 1) + "/" + ano);
    }

    else {
        var date_comp = (dia + "/" + (mes + 1) + "/" + ano);
    }

    //Registro das informações	

    var revAnterior =  parseInt($("#dateRevisao").val());

    if (nProcesso == 0) {

        $("#dataCadastro").val(date_comp);

    }

    $("#revisao").val(revAnterior + 1);
    $("#dateRevisao").val(date_comp); 

    return date_comp;

};

//MÁSCARAS

function maskMoney() {

    //Dinheiro
    var tOrcamento = $("#tOrcamento");
    tOrcamento.mask('#.##0.00#.##0,00', {reverse: true});

    var rItem = $("#rItem");
    rItem.mask('#.##0.00#.##0,00', {reverse: true});

    var orcamentoDesconto = $("#orcamentoDesconto");
    orcamentoDesconto.mask('#.##0.00#.##0,00', {reverse: true});

    var pVenda = $('#pVenda');
    pVenda.mask('#.##0.00#.##0,00', {reverse: true});

    var pCusto = $('#pCusto');
    pCusto.mask('#.##0.00#.##0,00', {reverse: true});

    //CEP
    var cep = $('#cep');
    cep.mask('00000-000', {reverse: true});

};

function maskPercent() {

    var desconto = $("#desconto");
    desconto.mask('000,00', {reverse: true});

};

//Busca e inserção de Subitens
var times = 0;
var rowPrevious = 0;

function pushSub_i() {  

    //Condição de Busca
    var tb_name = "tb_subitem";
    var tbdoc = document.getElementById('c7_total').value;

    //Filtro de Busca 
    var tbConstraint = DatasetFactory.createConstraint("tablename", tb_name, tb_name, ConstraintType.MUST);
    var docConstraint = DatasetFactory.createConstraint("tb_doc", tbdoc, tbdoc, ConstraintType.MUST);
    var arrayConstraint = new Array(tbConstraint, docConstraint);

    // Busca no Dataset + Condições de Filtro
    var array = DatasetFactory.getDataset("DSCadastroGeral", null, arrayConstraint, null);

    var nRow = array.values.length;

    var rowCount = ($('#tb_sub_I tr').length) - 2;


    if (tbdoc != "") {

        if (rowCount == 0) {


            for (var i = 0; i < nRow; i++) {

                eventFire(document.getElementById('add_sub'), 'click');

                var doc = array.values[i].tb_doc;
                var n = array.values[i].tb_n;
                var descricao = array.values[i].tb_descricao;
                var responsavel  = array.values[i].tb_responsavel;

                var rowInject = rowPrevious + (i + 1);

                $("#tb_doc_I___" + rowInject).val(doc);
                $("#tb_n_I___" + rowInject).val(n);
                $("#tb_descricao_I___" + rowInject).val(descricao);
                $("#tb_responsavel_I___" + rowInject).val(responsavel);

            }

            if (rowPrevious == 0) {
                rowPrevious = nRow;
            }
            else if (rowPrevious > 0) {
                rowPrevious = rowPrevious + nRow;
            }

            
        }
    }

    $(".excluir").bind("click", Excluir);
};

function eventFire(el, etype){
    if (el.fireEvent) {
      el.fireEvent('on' + etype);
    } else {
      var evObj = document.createEvent('Events');
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
};

var nFirst = 0;
var nLast = 0;
var nVariavel = 0;

function push_sItens() {

    var table = $('#tb_sub_I td input');

    var n_input = table.length - 4;

    var rows = n_input / 4;
    
    nLast = nFirst + rows;
    
    nFirst = nFirst +1;
    
    
    console.log('---')
    console.log(nFirst)
    console.log(nLast)
    console.log('---')

    for (var i = nFirst; i <= nLast; i++) {

        eventFire(document.getElementById('add_sub_h'), 'click');
        nVariavel++;

        
        var column1 = $("#tb_doc_I___"+i).val();
        var column2 = $("#tb_n_I___"+i).val();
        var column3 = $("#tb_descricao_I___"+i).val();
        var column4 = $("#tb_responsavel_I___"+i).val();

        $("#tb_doc_h___" + nVariavel).val(column1);
        $("#tb2_orc___" + nVariavel).val(idOAll);
        $("#tb_n_h___" + nVariavel).val(column2);
        $("#tb_descricao_h___" + nVariavel).val(column3);
        $("#tb_responsavel_h___" + nVariavel).val(column4);

        console.log('>>>>');
        console.log(column1);
        console.log(column2);
        console.log(column3);
        console.log(column4);
        console.log(nVariavel);
        console.log('<<<<');

        eventFire(document.getElementById('excluirSubitemOR___' + nVariavel), 'click');
    
    }

    nFirst = nLast;

    $(".excluir").bind("click", Excluir);

};

function safety() {

    // Obtém a data/hora atual
    var data = new Date();

    var dia = data.getDate();           // 1-31
    var mes = data.getMonth();          // 0-11 (zero=janeiro)
    var ano4 = data.getFullYear();      // 4 dígitos

    var str_data = dia + '/' + (mes+1) + '/' + ano4;

    $('#safety2').val(str_data);

    $('#safety').val(getWKUser());

}

//USUÁRIO RESPONSÁVEL
function usuario(id) {

    var user = getWKUser();

    var c1 = DatasetFactory.createConstraint("login", user, user, ConstraintType.MUST);

    var constraints = new Array(c1);

    var dataset = DatasetFactory.getDataset("colleague", null, constraints, null);

    $('#'+id).val(dataset.values[0].colleagueName);
     
        
};

function motherSon() {


    var dataset = DatasetFactory.getDataset("DSFormulariodeCadastrodeProdutoseServicos", null, null, null); 

    for (var i = 0; i < dataset.values.length; i++) {

        var array = dataset.values[i].codP.split('');

        if (array[4] == '-') {
        }
        else if (array[5] == '-') {
        }
        else if (array[6] == '-') {
        }
        else {

            $('#pertence').append($('<option>', {

                value: dataset.values[i].codP,
                text: dataset.values[i].codP
            }));
        }
        
    }   
}

$(document).on('change', "#pertence",
    function idSon() {
       
        var input = $('#pertence').val();
        var nIdSeq = 0;

        var dataset = DatasetFactory.getDataset("DSFormulariodeCadastrodeProdutoseServicos", null, null, null); 

        for (var i = 0; i < dataset.values.length; i++) {

            var array = dataset.values[i].codP.split('');

            if (dataset.values[i].codP.length > 4) {
                if (array[4] == '-') {
                    var idDataset = dataset.values[i].codP.substring(0, 4);
                }
                else if (array[5] == '-') {
                    var idDataset = dataset.values[i].codP.substring(0, 5);
                }
                else if (array[6] == '-') {
                    var idDataset = dataset.values[i].codP.substring(0, 6);
                }
                else {
                    var idDataset = dataset.values[i].codP;
                }
            }
            
            else {
                var idDataset = dataset.values[i].codP;
            }

            if (idDataset == input) {
                nIdSeq++;
            }

        }

        $('#codP').val(input+'-'+nIdSeq);

    });


$(document).on('change', "#compl",
    function pS() {

        var input = $('#compl').val();

        if (input == 'Sim') {
            $('#div_perc').removeClass();
            $('#div_perc').addClass('form-group col-md-6');

        }
        else {
            $('#div_perc').removeClass();
            $('#div_perc').addClass('form-group col-md-6 nav-close');
        }
        
    }
);

function groups() {     

    var dataset = DatasetFactory.getDataset("group", null, null, null);

    var count = dataset.values.length;

    $("#grupo_item").append('<option value="">Selecione...</option>');

    for(var i = 0; i < count; i++) {

        var opt = dataset.values[i]["groupPK.groupId"];

        $("#grupo_item").append('<option value=' + opt + '>' + opt + '</option>');
    }
}

$(document).on('change', "#descricao",
    function descFormId() {
		
		var name = $('#descricao').val();
		var dataset = DatasetFactory.getDataset("processAttachment", null, null, null);
		var nRow = dataset.values.length;
	
		var nProcess = dataset.values[nRow-1]['processAttachmentPK.processInstanceId'];
	
		$('#descForm').val(nProcess+1+' - '+name);
		
    }
);