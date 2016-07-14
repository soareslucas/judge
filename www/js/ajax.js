// recebe dados do formulário de registro de usuário 
// e envia os dados ao webservice
function cadastro(elem_id_nome, elem_id_sobrenome, elem_id_sexo, elem_id_status, elem_id_login, elem_id_senha, elem_id_email) {
    var nome = document.getElementById(elem_id_nome).value;
    var sobrenome = document.getElementById(elem_id_sobrenome).value;
    var sexo = document.getElementById(elem_id_sexo).value;
    var status = document.getElementById(elem_id_status).value;
    var login = document.getElementById(elem_id_login).value;
    var senha = document.getElementById(elem_id_senha).value;
    var email = document.getElementById(elem_id_email).value;
 
 // faz o formulário ficar vazio
    document.getElementById(elem_id_nome).value = '';
    document.getElementById(elem_id_sobrenome).value = '';
    document.getElementById(elem_id_sexo).value = '';
    document.getElementById(elem_id_status).value = '';
    document.getElementById(elem_id_login).value = '';
    document.getElementById(elem_id_senha).value = '';
    document.getElementById(elem_id_email).value = '';
    $.ajax({
        type: "POST",
        url: "http://localhost/appjudge/WebService.php",
        crossDomain: true,
        data: {servico: JSON.stringify({tipo: "cadastro", dados: {nome: nome, sobrenome: sobrenome, sexo: sexo, status: status, login: login, email: email, senha: senha, }})},
        dataType: 'json',
 		// mostra mensagem de login efetuado com sucesso
        success: function(response) {
            var res = JSON.stringify(response);
            var r = JSON.parse(res);
            alert(r.mensagem);
        },
        error: function(e) {
            var error = JSON.stringify(e);
            //var aux = JSON.parse(error);
            alert("error: " + error);
        }
    });
}

// é chamado da página check-in novo estabelecimento
// pega valores do formulário e envia ao webservice para cadastro do novo estabelecimento
function insereEstabelecimento() {
    var nome = document.getElementById('nomeEstab').value;
    var endereco = document.getElementById('endereco').value;
    var categoria = document.getElementById('categoria').value;
    var latitude = window.localStorage.getItem('latitudeEstab');
    var longitude = window.localStorage.getItem('longitudeEstab');
    var usuario = window.localStorage.getItem('user');
    var atributos = arrayAtrib;
    var valores = getRadio();
    var date = new Date();
    var horachegada = date.getTime();
	
    $.ajax({
        type: "POST",
        url: "http://localhost/appjudge/WebService.php",
        crossDomain: true,
        data: {servico: JSON.stringify({tipo: "insereEstabelecimento", dados: {nome: nome, endereco: endereco, categoria: categoria, latitude: latitude, longitude: longitude, usuario: usuario, atributos: atributos, valores: valores, horachegada: horachegada}})},
        dataType: 'json',
        success: function(response) {  

            var res = JSON.stringify(response);
            var r = JSON.parse(res);
			//check-in com sucesso
            alert(r.mensagem);
		
		//redireciona para a tela inicial
            window.self.location.href = "comeco.html";
        },
        error: function(e) {
            var error = JSON.stringify(e);
            alert("error: " + error);
        }
    });
}

// pega data em formato TimeStamp
// e converte para formato convencional
function converte(){
    var data = new Date();
    var date = new Date(data.getTime());
// hours part from the timestamp
    var hours = date.getHours();
// minutes part from the timestamp
    var minutes = date.getMinutes();
// seconds part from the timestamp
    var seconds = date.getSeconds();
    var formattedTime = hours + ':' + minutes + ':' + seconds;
    alert(formattedTime);
}

// pega dados do formulário de login e realiza o login no webservice
function validar(elem_id_login, elem_id_senha) {

    var login = document.getElementById(elem_id_login).value;
    var senha = document.getElementById(elem_id_senha).value;
    document.getElementById(elem_id_login).value = '';
    document.getElementById(elem_id_senha).value = '';
	
    $.ajax({
        type: "POST",
        url: "http://localhost/appjudge/WebService.php",
        crossDomain: true,
        data: {servico: JSON.stringify({tipo: "login", dados: {login: login, senha: senha}})},
        dataType: 'json',
        success: function(aux) {
            var res = JSON.stringify(aux);
            var r = JSON.parse(res);
			//mesagem para login incorreto
			if (r.mensagem === 'Login ou senha incorretos!') {
				alert(r.mensagem);
			} else {
				//  mostra nome e sobrenome do usuário caso o login esteja correto
				alert('Login com sucesso para ' + r.nome + " " + r.sobrenome);
				//armazena localmente o id do usuário para que seja recuperado em qualquer momento da navegação
				// e para ser verificado se há um usuário logado
				window.localStorage.setItem("user", r.id);
				window.self.location.href = "comeco.html";
			}
        },
        error: function(e) {
            var error = JSON.stringify(e);
            alert("error: " + error);
        }
    });
}

// cria o perfil do usuário quando for chamada a página meu perfil
function carregaPerfil() {
	// busca id já gravado anteriormente no momento do login
    var id = window.localStorage.getItem("user");
	
    $.ajax({
        type: "POST",
        url: "http://localhost/appjudge/WebService.php",
        crossDomain: true,
        beforeSend: function() {
        },
        complete: function() {
        },
        data: {servico: JSON.stringify({tipo: "perfil", dados: {id: id}})},
        dataType: 'json',
        success: function(aux) {
            var res = JSON.stringify(aux);
            var r = JSON.parse(res);
            geraPerfil(r);
        },
        error: function(e) {
            var error = JSON.stringify(e);
            alert("error: " + error);
        }
    });
}

function carregaEstabelecimentosUltimos() {

    $.ajax({
        type: "POST",
        url: "http://localhost/appjudge/WebService.php",
        crossDomain: true,
        data: {servico: JSON.stringify({tipo: "ultimosInseridos", dados: {id: "inicio"}})},
        dataType: 'json',
        success: function(aux) {
            var res = JSON.stringify(aux);
            var r = JSON.parse(res);
            geraEstabelecimentosUltimos(r);
        },
        error: function(e) {
            var error = JSON.stringify(e);
            alert("error: " + error);
        }
    });
}

function geraEstabelecimentosUltimos(estab) {
    var dist;
    var pontoEstabelecimento;
    var kms;
    var latitudeUsuario = window.localStorage.getItem('latitudeUsuario');
    var longitudeUsuario = window.localStorage.getItem('longitudeUsuario');
    var pontoUsuario = latitudeUsuario + "," + longitudeUsuario;
    var element = document.getElementById('listaUltimos');
    var html = "<tr> " + "<th>Categoria</th> " +
            "   <th>Nome</th>" +
            "<th>Distância do seu local:</th>" +
            "</tr>";

    for (i = 0; i < estab.length; i++) {
        pontoEstabelecimento = estab[i].latitude + "," + estab[i].longitude;
        dist = getDistance(pontoUsuario, pontoEstabelecimento);
        kms = dist / 1000;
        html = html + " <tr> <td> " + estab[i].categoria + "</td>  <td>  <a href='javascript: chamaEstabelecimento(" + estab[i].id + ");' > " +
                estab[i].nome + "</a> </td> <td >" + kms + "Km</td></tr>";
    }
    element.innerHTML = html;
}

function carregaEstabelecimentosRaking() {

    $.ajax({
        type: "POST",
        url: "http://localhost/appjudge/WebService.php",
        crossDomain: true,
        data: {servico: JSON.stringify({tipo: "melhoresQualificados", dados: {id: "inicio"}})},
        dataType: 'json',
        success: function(aux) {
            var res = JSON.stringify(aux);
            var r = JSON.parse(res);
            geraEstabelecimentosRaking(r);
        },
        error: function(e) {
            var error = JSON.stringify(e);
            alert("error: " + error);
        }
    });
}

function geraEstabelecimentosRaking(estab) {
    var html = "<tr> " + "<th>Categoria</th> " +
            "   <th>Nome Estabelecimento</th>" +
            "<th>Pontuação (0-5)</th>" +
            "</tr>";
    $("#listaRanking").append(html);
    var i = estab.length;
    i = i - 1;

    while (i >= 0) {
        html = " <tr> <td> " + estab[i].categoria + "</td>  <td>  <a href='javascript: chamaEstabelecimento(" +
                estab[i].id + ")'> " + estab[i].nome + " </a> </td> <td> <div id='" + estab[i].id + "' > </div></td></tr>";
        $("#listaRanking").append(html);
        carregaMediaInicio(estab[i].id);
        i = i - 1;
    }
}

function carregaMediaInicio(id) {
    $.ajax({
        type: "POST",
        url: "http://localhost/appjudge/WebService.php",
        crossDomain: true,
        data: {servico: JSON.stringify({tipo: "mediaAtributos", dados: {id: id}})},
        dataType: 'json',
        success: function(aux) {
            var res = JSON.stringify(aux);
            var r = JSON.parse(res);
            geraMediaInicio(id, r);
        },
        error: function(e) {
            var error = JSON.stringify(e);
            alert("error: " + error);
        }
    });
}

function geraMediaInicio(id, media) {
    var div = "#" + id;
    $(div).append("<h6>" + media[0].mediaAtributos + "</h6>");
}

function carregaEstabelecimentosQualificados() {
    $.ajax({
        type: "POST",
        url: "http://localhost/appjudge/WebService.php",
        crossDomain: true,
        data: {servico: JSON.stringify({tipo: "ultimosVisitados", dados: {id: "inicio"}})},
        dataType: 'json',
        success: function(aux) {
            var res = JSON.stringify(aux);
            var r = JSON.parse(res);
            geraEstabelecimentosQualificados(r);
        },
        error: function(e) {
            var error = JSON.stringify(e);
            alert("error: " + error);
        }
    });
}

function geraEstabelecimentosQualificados(estab) {
    var element = document.getElementById('listaQualificados');
    var html = "<tr> " + "<th>Hora:</th> " +
            "   <th>Nome Estabelecimento</th>" +
            "<th>Endereco</th>" +
            "</tr>";  
			
    for (i = 0; i < estab.length; i++) {
        var horachegada = estab[i].horachegada;
		// a ser substituido por função declarada -- rotina repetida várias vezes.
        var num = new Number(horachegada);
        var date = new Date(num);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var formattedTime = hours + ':' + minutes ;
        html = html + " <tr> <td> " + formattedTime + "</td>  <td>  <a href='javascript: chamaEstabelecimento(" +
                estab[i].id + ")'> " + estab[i].nome + " </a> </td> <td > <h6> " +
                estab[i].endereco + "</h6></td></tr>";
    }
    element.innerHTML = html;
}

function carregaEstabelecimentosHistorico() {
    var id = window.localStorage.getItem("user");

    $.ajax({
        type: "POST",
        url: "http://localhost/appjudge/WebService.php",
        crossDomain: true,
        data: {servico: JSON.stringify({tipo: "ultimosCheckIn", dados: {id: id}})},
        dataType: 'json',
        success: function(aux) {
            var res = JSON.stringify(aux);
            var r = JSON.parse(res);
            geraEstabelecimentosHistorico(r);
        },
        error: function(e) {
            var error = JSON.stringify(e);

            alert("error: " + error);
        }
    });
}

function geraEstabelecimentosHistorico(estab) {
    var element = document.getElementById('listaUltUsuario');
    var html = "<tr> " + "<th>Hora:</th> " +
            "   <th>Estabelecimento</th>" +
            "<th>Endereco</th>" +
            "</tr>";
			
    for (i = 0; i < estab.length; i++) {
        var horachegada = estab[i].horachegada
		// a ser substituido por função declarada -- rotina repetida várias vezes.
        var num = new Number(horachegada);
        var date = new Date(num);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var formattedTime = hours + ':' + minutes ;
        html = html + " <tr> <td> " + formattedTime + "</td>  <td>  <a href='javascript:chamaEstabelecimento(" + estab[i].id + ");' > " +
                estab[i].nome + "</a> </td>  <td > <h6> " +
                estab[i].endereco + "</h6></td> <td ></tr>";
    }
    element.innerHTML = html;
}

function carregarAtributos() {
    $.ajax({
        type: "POST",
        url: "http://localhost/appjudge/WebService.php",
        crossDomain: true,
        data: {servico: JSON.stringify({tipo: "atributos", dados: {}})},
        dataType: 'json',
        success: function(aux) {
            var res = JSON.stringify(aux);
            var r = JSON.parse(res);
            geraAtributos(r);
        },
        error: function(e) {
            var error = JSON.stringify(e);
            alert("error: " + error);
        }
    });
}

function geraPerfil(perfil) {
    var nome = document.getElementById('nome');
    nome.innerHTML = perfil.nome + " " + perfil.sobrenome;
    var sexo = document.getElementById('sexo');
    if (perfil.sexo === "1") {
        sexo.innerHTML = "Masculino";
    } else {
        sexo.innerHTML = "Feminino";
    }
    var status = document.getElementById('status');
    status.innerHTML = perfil.statusrelacionamento;
    var email = document.getElementById('email');
    email.innerHTML = perfil.email;
}

function geraAtributos(atrib) {
    var element = document.getElementById('atributos');
    var html = " <option value=''>Selecione</option>";
    for (i = 0; i < atrib.length; i++) {
        var nome = atrib[i].nome;
        var id = atrib[i].id;
        html = html + " <option value='" + id + "'>" + nome + "</option>";
    }
    element.innerHTML = html;
}

function atribEstab() {
    var idAtrib = document.getElementById('atributos').value;
    var jaAdd = false;
    for (i = 0; i < arrayAtrib.length; i++) {
        if (arrayAtrib[i] === idAtrib) {
            jaAdd = true;
            alert('Atributo já foi adicionado!');
        }
    }

    if (jaAdd === false) {
        arrayAtrib[numAtrib] = idAtrib;
        numAtrib = numAtrib + 1;
        $.ajax({
            type: "POST",
            url: "http://localhost/appjudge/WebService.php",
            crossDomain: true,
            data: {servico: JSON.stringify({tipo: "retornaAtributo", dados: {atributo: idAtrib}})},
            dataType: 'json',
            success: function(aux) {
                var res = JSON.stringify(aux);
                var r = JSON.parse(res);
                addAtrib(r[0].nome, idAtrib);
            },
            error: function(e) {
                var error = JSON.stringify(e);
                alert("error: " + error);
            }
        });
    }
}

// retorna valor atribuido pelo usuário através do 
// componente radio, mostrado na tela como estrelas
function getRadio() {
    var valoresAtrib = [];
    for (i = 0; i < arrayAtrib.length; i++) {
        var busca = "input:radio[name=" + arrayAtrib[i] + "]";
//Executa Loop entre todas as Radio buttons com o name de valor
        $(busca).each(function() {
//Verifica qual está selecionado
            if ($(this).is(':checked'))
                valoresAtrib[i] = parseInt($(this).val());
        });
    }
    return valoresAtrib;
}

function listaAtribEstab() {
    var idAtrib = document.getElementById('atributos').value;
    $.ajax({
        type: "POST",
        url: "http://localhost/appjudge/WebService.php",
        crossDomain: true,
        data: {servico: JSON.stringify({tipo: "retornaAtributo", dados: {atributo: idAtrib}})},
        dataType: 'json',
        success: function(aux) {
            var res = JSON.stringify(aux);
            var r = JSON.parse(res);
            addAtrib(r[0].nome, idAtrib);
        },
        error: function(e) {
            var error = JSON.stringify(e);
            alert("error: " + error);
        }
    });
}

var arrayAtrib = [];
var numAtrib = 0;
function addAtrib(atributo, idAtrib) {
    var html = "<div class='row'><span class='star-rating'> \n\
         <input type='radio' name='" + idAtrib + "' value='1'><i></i>\n\
         <input type='radio' name='" + idAtrib + "' value='2'><i></i>      \n\
         <input type='radio' name='" + idAtrib + "' value='3'><i> </i> \n\
          <input type='radio' name='" + idAtrib + "' value='4'><i></i>    \n\
         <input type='radio' name='" + idAtrib + "' value='5'><i></i>  \n\
          </span> <br>\n\
         <strong id='rating' class='choice'>" + atributo + "</strong>  </div>";
    $("#qualificacao").append(html);
}

function chamaEstabelecimento(id) {
    window.localStorage.setItem('estabelecimento', id);
    window.self.location.href = "estabelecimento.html";
}

function carregaEstabelecimento() {
    var id = window.localStorage.getItem('estabelecimento');
	
    $.ajax({
        type: "POST",
        url: "http://localhost/appjudge/WebService.php",
        crossDomain: true,
        data: {servico: JSON.stringify({tipo: "estabelecimento", dados: {id: id}})},
        dataType: 'json',
        success: function(aux) {
            var res = JSON.stringify(aux);
            var r = JSON.parse(res);
            geraEstabelecimento(r);
        },
        error: function(e) {
            var error = JSON.stringify(e);
            alert("error: " + error);
        }
    });
}

var distancia;
var atributos = [];
var estabelecimento;
function geraEstabelecimento(estab) {
    obterLocalUsuario();
    estabelecimento = estab;
    var nome = document.getElementById('nome');
    nome.innerHTML =  "<legend class='pull-left width-full'>"+estab.nome+"</legend>";
    var categoria = document.getElementById('categoria');
    categoria.innerHTML = "<h5>" + estab.categoria + "</h5>";
    var endereco = document.getElementById('endereco');
    endereco.innerHTML = "<h5>" + estab.endereco + "</h5>";
    var pontoEstabelecimento = estab.latitude + "," + estab.longitude;
    window.localStorage.setItem('latitudeMap', estab.latitude);
    window.localStorage.setItem('longitudeMap', estab.longitude);
    var latitudeUsuario = window.localStorage.getItem('latitudeUsuario');
    var longitudeUsuario = window.localStorage.getItem('longitudeUsuario');
    var pontoUsuario = latitudeUsuario + "," + longitudeUsuario;
    distancia = getDistance(pontoUsuario, pontoEstabelecimento);
    var kms = distancia / 1000;
    var dist = document.getElementById('distancia');
    dist.innerHTML = "<h6>" + kms + " Km" + "</h6>";
    atributos = estab.atributos;
    var html = "";
    for (i = 0; i < atributos.length; i++) {
        html = html + "<div class='row'><span class='star-rating'> \n\
         <input type='radio' name='" + atributos[i].id + "' value='1'><i></i>\n\
         <input type='radio' name='" + atributos[i].id + "' value='2'><i></i>      \n\
         <input type='radio' name='" + atributos[i].id + "' value='3'><i> </i> \n\
          <input type='radio' name='" + atributos[i].id + "' value='4'><i></i>    \n\
         <input type='radio' name='" + atributos[i].id + "' value='5'><i></i>  \n\
          </span> <br>\n\
         <strong id='rating' class='choice'>" + atributos[i].nome + "</strong>  </div>";
    }
    $("#atributos").append(html);
}

function carregaQualificacoes() {
    var id = window.localStorage.getItem('estabelecimento');
	
    $.ajax({
        type: "POST",
        url: "http://localhost/appjudge/WebService.php",
        crossDomain: true,
        data: {servico: JSON.stringify({tipo: "ultimasQualificacoes", dados: {id: id}})},
        dataType: 'json',
        success: function(aux) {
            var res = JSON.stringify(aux);
            var r = JSON.parse(res);
            geraUltQualificacoes(r);
        },
        error: function(e) {
            var error = JSON.stringify(e);
            alert("error: " + error);
        }
    });
}

function geraUltQualificacoes(estab) {
    var nome = document.getElementById('nome');
    nome.innerHTML = estab.nome;
    var categoria = document.getElementById('categoria');
    categoria.innerHTML = estab.categoria;
    var endereco = document.getElementById('endereco');
    endereco.innerHTML = estab.endereco;
}

function carregaMedia() {
    var id = window.localStorage.getItem('estabelecimento');
    $.ajax({
        type: "POST",
        url: "http://localhost/appjudge/WebService.php",
        crossDomain: true,
        data: {servico: JSON.stringify({tipo: "mediaAtributos", dados: {id: id}})},
        dataType: 'json',
        success: function(aux) {
            var res = JSON.stringify(aux);
            var r = JSON.parse(res);
            geraMedia(r);
        },
        error: function(e) {
            var error = JSON.stringify(e);
            alert("error: " + error);
        }
    });
}

function geraMedia(estab) {
    var nome = document.getElementById('media');
    nome.innerHTML = "<div class='row'><h5>Media Estabelecimento:  " + "     " + estab[0].mediaAtributos + " </h5></div>";
}

function carregaMediaAtributos() {
    var id = window.localStorage.getItem('estabelecimento');
    $.ajax({
        type: "POST",
        url: "http://localhost/appjudge/WebService.php",
        crossDomain: true,
        data: {servico: JSON.stringify({tipo: "mediaPorAtributo", dados: {id: id}})},
        dataType: 'json',
        success: function(aux) {
            var res = JSON.stringify(aux);
            var r = JSON.parse(res);
            geraMediaAtributo(r);
        },
        error: function(e) {
            var error = JSON.stringify(e);
            alert("error: " + error);
        }
    });
}

function geraMediaAtributo(atrib) {
    var nome = document.getElementById('mediaAtributos');
    var html = "";
    for (i = 0; i < atrib.length; i++) {
        html = html + " <div class='row'> <h5> Media " + atrib[i].nome + ": " + "     " + atrib[i].mediaAtributos + " </h5></div>";
    }
    nome.innerHTML = html;
}

function checkin() {
    if (distancia > 200) {
        alert('Para checkin você deve frequentar o lugar!');
    } else {
        var usuario = window.localStorage.getItem('user');
        var estabelecimento = window.localStorage.getItem('estabelecimento');
        var valores = getRadioCheckin();
        var date = new Date();
        var horachegada = date.getTime();
        $.ajax({
            type: "POST",
            url: "http://localhost/appjudge/WebService.php",
            crossDomain: true,
            data: {servico: JSON.stringify({tipo: "checkin", dados: {estabelecimento: estabelecimento, usuario: usuario, valores: valores, horachegada: horachegada}})},
            dataType: 'json',
            success: function(response) {
                var res = JSON.stringify(response);
                var r = JSON.parse(res);
                alert(r.mensagem);
                window.self.location.href = "comeco.html";
            },
            error: function(e) {
                var error = JSON.stringify(e);
                alert("error: " + error);
            }
        });
    }
}

function getRadioCheckin() {
    var valoresAtrib = new Array();

    for (i = 0; i < atributos.length; i++) {
        var busca = "input:radio[name=" + atributos[i].id + "]";
        $(busca).each(function() {
            if ($(this).is(':checked')) {
                var valor = parseInt($(this).val());
                valoresAtrib.push({id: atributos[i].id, valor: valor})
            }
            ;
        }); 
    }
    return valoresAtrib;
}

function getDistance(pointA, pointB) {
    var r = 6371.0;
    var pointA_data = pointA.split(',');
    var pointB_data = pointB.split(',');
    pointA_lat = parseFloat(pointA_data[0]) * Math.PI / 180.0;
    pointA_lon = parseFloat(pointA_data[1]) * Math.PI / 180.0;
    pointB_lat = parseFloat(pointB_data[0]) * Math.PI / 180.0;
    pointB_lon = parseFloat(pointB_data[1]) * Math.PI / 180.0;
    diff_lat = pointB_lat - pointA_lat;
    diff_lon = pointB_lon - pointA_lon;
    var a = Math.sin(diff_lat / 2) * Math.sin(diff_lat / 2) +
            Math.cos(pointA_lat) * Math.cos(pointB_lat) *
            Math.sin(diff_lon / 2) * Math.sin(diff_lon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(r * c * 1000);
}