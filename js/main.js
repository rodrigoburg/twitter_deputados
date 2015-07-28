var data;
var sigla = "TOTAL"; //valor default
var seletor_atual = $("li").find("a"); //default total
var table;
var seguidos_existe = false;
var mapa_existe = false;
var width = $(window).width();
var height = .7*width;
var margin_left = 10;
var margin_top = 7;
var grafico_atual;

var cores = {
    "PT"       :["#a00200"],
    "PST"      :["#a51001"],
    "PL"       :["#aa1d01"],
    "PTC"      :["#b02b01"],
    "PCdoB"    :["#b53901"],
    "PP"       :["#ba4601"],
    "PPB"       :["#ba4601"],
    "PRB"      :["#bf5301"],
    "PSL"      :["#c46102"],
    "PPL"      :["#ca6f03"],
    "PSB"      :["#cf7d03"],
    "PMDB"     :["#006500"],
    "PROS"     :["#d99803"],
    "PRTB"     :["#dea604"],
    "PTB"      :["#e4b304"],
    "PRP"      :["#e9c104"],
    "PDT"      :["#eece04"],
    "PHS"      :["#f3dc05"],
    "PR"       :["#f4e509"],
    "PTN"     :["#f4e509"],
    "PSC"      :["#eae116"],
    "PMR"      :["#dfdd24"],
    "PTdoB"    :["#d5d931"],
    "PV"       :["#cad63e"],
    "PMN"      :["#c0d24b"],
    "PSD"      :["#b6ce58"],
    "PEN"      :["#abc966"],
    "SDD"      :["#a1c673"],
    "PSOL"     :["#97c281"],
    "PPS"      :["#8cbe8e"],
    "DEM"      :["#82ba9b"],
    "PFL_DEM"  :["#77b6a8"],
    "PSDB"     :["#0F186E"],
    "PRONA"    :["#62afc3"],
    "PAN"      :["#58abd0"],
    "PSDC"     :["#4da7de"]
}

function acha_cor(partido) {
    return cores[partido]
}

//funcões que vamos usar na inicializacao
//a primeira cria um método para capitalizar só as primeiras letras de uma string
String.prototype.capitalize = function() {
    var temp = this.split(" ");
    var saida = "";
    temp.forEach(function (d){
        saida += d.charAt(0).toUpperCase() + d.slice(1).toLowerCase() + " ";
    })
    return saida.trim();
}

//aqui cria a clicalização das tabs
$('#escolhe-grafico a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
    troca_grafico()
})

function troca_grafico() {
    if (grafico_atual == "#mapa") {
        //se a tabela ainda nao existir, baixa os dados e cria a tabela
        if (!(seguidos_existe)) {
            baixa_seguidos();
        }
        grafico_atual = "#seguidos";
        window.location.hash = grafico_atual;
    }
    else {
        if (!(mapa_existe)) {
            baixa_mapa();
        }
        grafico_atual = "#mapa";
        window.location.hash = grafico_atual;
    }
};

function baixa_seguidos() {
    $.getJSON("dados/dados_tabela.json", function (dados) {
        seguidos_existe = true;
        dados_tabela = dados;

        cria_tabela();
        cria_filtro_partido();
    });
}
function cria_filtro_partido() {
    //adiciona primeiro esses seis partidos, em forma de li
    var partidos_primeiros = [ "PT","PSDB","PMDB","PSB","PSD","PP"]
    var lista = $("ul.partido")
    partidos_primeiros.forEach(function (key) {
        lista.append('<li><a href="#seguidos">' + key + '</a></li>')
    })

    //agora adiciona todos os outros, que estão nos dados mas não no array abaixo-
    var lista_inicial = ["Perfil", "Categoria", "Total de deputados seguindo","PT","PSDB","PMDB","PSB","PSD","PP"];
    for (key in dados_tabela) {
        if (lista_inicial.indexOf(key) == -1) {
            lista.append('<li><a href="#seguidos">' + key + '</a></li>')
        }
    }

    //quando clicarem na linha
    lista.click(function (e) {
        //tira o bold do antigo
        seletor_atual.html(sigla)

        //atualiza as variaveis
        seletor_atual = $(e.target);
        sigla = seletor_atual.html();

        //coloca bold no novo
        seletor_atual.html("<b>"+sigla+"</b>")

        //agora limpa a tabela
        table.clear()

        //e adiciona os dados novos linha a linha
        if (sigla == "TOTAL") {
            for (var i = 0;i < dados_tabela["Perfil"].length;i++) {
                var linha = [dados_tabela["Perfil"][i],dados_tabela["Categoria"][i],dados_tabela["Total de deputados seguindo"][i]];
                table.row.add(linha)
            }
            $("#total").html("Total de deputados seguindo");
        } else {
            for (var i = 0;i < dados_tabela["Perfil"].length;i++) {
                var linha = [dados_tabela["Perfil"][i],dados_tabela["Categoria"][i],dados_tabela[sigla][i]];
                table.row.add(linha)
            }
            table.column(2).order("desc")
            $("#total").html("Total de deputados seguindo ("+sigla+")")
        }
        table.draw();
    });
}

function cria_tabela() {
    tableHTML = '<table class="tabela table table-hover table-condensed table-striped table-bordered">';
    tableHeader = "<thead><tr>"
    tableBody = "<tbody>"
    var lista_inicial = ["Perfil","Categoria","Total de deputados seguindo"];
    lista_inicial.forEach(function (d) {
        if (d == "Total de deputados seguindo") {
            tableHeader += "<th id='total'>" + d + "</th>";
        } else {
            tableHeader += "<th>" + d + "</th>";
        }
    });
    tableHeader += "</tr></thead>"
    var tamanho = dados_tabela[lista_inicial[0]].length;
    for (i = 0; i < tamanho; i++) {
        var linha = "<tr>"
        lista_inicial.forEach(function (d) {
            if (d == "Perfil") {
                linha += "<td class='perfil'>"+dados_tabela[d][i]+"</td>"
            } else if (d == "Total de deputados seguindo") {
                linha += "<td class='numero'>" + dados_tabela[d][i] + "</td>"
            }  else {
                    linha += "<td>"+dados_tabela[d][i]+"</td>"
            }
        })
        linha += "</tr>"
        tableBody += linha
    }

    tableBody += "</tbody>"
    tableHTML += tableHeader + tableBody + "</table>"
    $("#tabela").append(tableHTML)

    var $tfoot = $('<tfoot></tfoot>');
    $($('thead').clone(true, true).children().get().reverse()).each(function(){
        $tfoot.append($(this));
    });
    $tfoot.insertAfter('table thead');


    $('.tabela tfoot th').each( function () {
        var title = $('.tabela thead th').eq( $(this).index() ).text();
        if (title == "Perfil" || title == "Categoria") {
            $(this).html( '<input type="text" placeholder="Buscar '+title+'" />' );
        } else {
            $(this).html("");
        }
    } );

    table = $(".tabela").DataTable({
        aaSorting: [],
        "lengthMenu": [[25, 50, 100, 150, -1], [25, 50, 100, 150, "Todos"]],
        "language": {
            "lengthMenu": "Mostrar _MENU_ linhas por página",
            "zeroRecords": "Não foi encontrado nenhum item",
            "info": "Mostrando página _PAGE_ de _PAGES_",
            "infoEmpty": "Não foi encontrado nenhum item",
            "infoFiltered": "(filtrado do total de _MAX_ itens)",
            "paginate":{
                "previous":"Anterior",
                "next":"Próxima",
                "first":"Primeira",
                "last":"Última"
            }
        }
    });

    table.columns().every( function () {
        var that = this;
        $( 'input', this.footer() ).on( 'keyup change', function () {
            that
                .search( this.value )
                .draw();
        } );
    } );
    $(".dataTables_filter").remove();
    $("label").addClass("pull-left")
}

function desenha_grafico() {
    var svg = dimple.newSvg("#div-mapa", width, height);
    var myChart = new dimple.chart(svg, data);
    myChart.setBounds(margin_left, margin_top+30, width-margin_left*7, height-margin_top*5);
    var y = myChart.addMeasureAxis("y", "y");
    y.overrideMax=.4;
    y.overrideMin=-.4;
    var x = myChart.addMeasureAxis("x", "x");
    x.overrideMax=.25;
    x.overrideMin=-.41;
    series = myChart.addSeries(["nome","partido"], dimple.plot.bubble);
    for (var cor in cores) {
        myChart.assignColor(cor,acha_cor(cor),acha_cor(cor));
    }
    series.addEventHandler("mouseover", function (e) { destaca(e) })
    series.addEventHandler("click", function (e) { destaca(e) })

    series.addEventHandler("mouseout", function (e) { retira_destaque(e) })

    myLegend = myChart.addLegend(15, 0, 800, 20, "left");
    myLegend._getEntries = function () {
        var orderedValues = ["PT", "PSDB", "PMDB", "PSD", "PP"];
        var entries = [];
        orderedValues.forEach(function (v) {
            entries.push(
                {
                    key: v,
                    fill: myChart.getColor(v).fill,
                    stroke: myChart.getColor(v).stroke,
                    opacity: myChart.getColor(v).opacity,
                    series: series,
                    aggField: [v]
                }
            );
        }, this);

        return entries;
    };

    myChart.draw(4000);
    $('.dimple-axis').remove();
    if (width < 500) {
        $("circle").attr("r","1.5")
    }
}

function destaca(e) {
    var nome = e.seriesValue[0];
    var partido = e.seriesValue[1];

    $("#topo").css({background: acha_cor(partido)})
    $(".tooltip").css({
        opacity: 1,
        "border-color": acha_cor(partido),
        left: event.pageX - 15,
        top: event.pageY - 20

    });
    var topo = partido;
    var resto = nome.capitalize();
    $("#topo").html(topo);
    $("#resto").html(resto);
}

function retira_destaque(e) {
    $(".tooltip").css({
        opacity:0
    })
}

function baixa_mapa() {
    d3.csv( "dados/scatter_deps.csv", function( dados ) {
        mapa_existe = true;
        data = dados
        desenha_grafico()
    })
}

function inicializa() {
    var hash = window.location.hash;
    if (hash == "#seguidos") {
        grafico_atual = "#seguidos";
        $("li.seguidos").addClass("active")
        $("#div-seguidos").addClass("active")
        baixa_seguidos()
    } else {
        grafico_atual = "#mapa";
        $("li.mapa").addClass("active")
        $("#div-mapa").addClass("active")
        window.location.hash = grafico_atual;
        baixa_mapa()
    }
}


