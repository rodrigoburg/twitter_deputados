var data;
width = $(window).width();
height = .7*width;
margin_left = 10;
margin_top = 7;

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
    "PSDB"     :["#0000cc"],
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
    series.getTooltipText = function (e) {
        return [ e.aggField[0] +" ("+ e.aggField[1]+")"]
    }
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

function inicializa() {
    d3.csv( "dados/scatter_deps.csv", function( dados ) {
        data = dados
        desenha_grafico()
    })
}


