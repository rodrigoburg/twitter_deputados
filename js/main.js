var data;
width = $(window).width();
height = 700;
margin_left = 70;
margin_top = 30;

cores = {
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
    "PMDB"     :["#d48b03"],
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
    "PSDB"     :["#6db3b6"],
    "PRONA"    :["#62afc3"],
    "PAN"      :["#58abd0"],
    "PSDC"     :["#4da7de"]
}

function acha_cor(partido) {
    return cores[partido]
}

function desenha_grafico() {
    var svg = dimple.newSvg("#grafico", width, height);
    var myChart = new dimple.chart(svg, data);
    myChart.setBounds(margin_left, margin_top, width-margin_left*4, height-margin_top*3);
    var y = myChart.addMeasureAxis("y", "y");
    var x = myChart.addMeasureAxis("x", "x");
    series = myChart.addSeries(["nome","partido"], dimple.plot.bubble);
    for (var cor in cores) {
        myChart.assignColor(cor,acha_cor(cor),acha_cor(cor));
    }

    myChart.draw(1000);
}

function inicializa() {
    d3.csv( "dados/scatter_deps.csv", function( dados ) {
        data = dados
        desenha_grafico()
    })
}

$('.dimple-axis').hide()

