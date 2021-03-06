document.addEventListener('DOMContentLoaded', function () {
//$(document).ready(function() {

  var csvFile = 'korona.gov.sk.csv';  // https://mapa.covid.chat/export/csv

  var options = {
    chart: {
      // height: '100%',
      scrollablePlotArea: {
        minWidth: 700
      }
    },

    data: {
      // csvURL: 'https://mapa.covid.chat/export/csv',
      itemDelimiter: ';',
      beforeParse: function (csv) {
        return csv.replace(/\n\n/g, '\n');
      }
    },

    title: {
      text: 'Komentovaný denný vývoj pandámie Covid-19 na Slovensku'
    },

    // subtitle: {
    //   text: 'Chýba ti tvoj obľúbeny výrok? <a href="https://github.com/granci/proroci-korony/blob/main/quotes.js" target="_blank">Doplň ho!</a>'
    // },

    caption: {
      useHTML: true,
      text: 'Chýba ti nejaký výrok? Doplň ho do repa: <a href="https://github.com/granci/proroci-korony/" target="_blank">github.com/granci/proroci-korony</a>'
    },

    xAxis: {
      tickInterval: 7 * 24 * 3600 * 1000, // one week
      tickWidth: 0,
      gridLineWidth: 1,
      labels: {
        align: 'left',
        x: 3,
        y: -3
      }
    },

    yAxis: [{ // left y axis
      title: {
        text: null
      },
      labels: {
        align: 'left',
        x: 3,
        y: 16,
        format: '{value:.,0f}'
      },
      showFirstLabel: false
    }, { // right y axis
      linkedTo: 0,
      gridLineWidth: 0,
      opposite: true,
      title: {
        text: null
      },
      labels: {
        align: 'right',
        x: -3,
        y: 16,
        format: '{value:.,0f}'
      },
      showFirstLabel: false
    }],

    legend: {
      align: 'left',
      verticalAlign: 'bottom',
      borderWidth: 0
    },

    tooltip: {
      shared: true,
      crosshairs: true
    },

    plotOptions: {
      series: {
        // showCheckbox: true,
        selected: true,
        // showInLegend: true,
        cursor: 'pointer',
        events: {
          legendItemClick: function () {
            var visibility = this.visible ? 'visible' : 'hidden';
          }
        },
        marker: {
          lineWidth: 1
        }
      }
    }
  };

  function mkAnnos(quotes, maxVal) {
    var annos = [];
    var colors = {
      science: '255, 204, 204',
      politics: '102, 204, 255',
      influencer: '173, 235, 173',
      artist: '221, 153, 255',
      other: '200, 200, 200',
    };
    quotes.forEach(q => {
      var timestamp = new Date(q.date);
      var yAnchor = 5000 + Math.random() * (maxVal - 5000);
      // console.log(yAnchor, q.name, colors[q.tag]);
      var anno = {
        labelOptions: {
          verticalAlign: 'bottom',
          y: -15,
          useHTML: true,
          allowOverlap: true,
          overflow: 'justify',
          // shape: 'connector',
          // align: 'right',
        },
        labels: [
          {
            point: {
              xAxis: 0,
              yAxis: 0,
              x: new Date(q.date),
              y: yAnchor
            },
            backgroundColor: colors[q.tag] ? 'rgba(' + colors[q.tag] + ', 0.7)' : 'rgba(' + colors.other + ', 0.7)',
            // borderColor: colors[q.tag] ? 'rgb(' + colors[q.tag] + ')' : 'rgba(' + colors.other + ')',
            text: '<div style="width: 150px; white-space: normal">"' + q.quote + '"</br><a href="' + q.link + '" target="_blank">- ' + q.name + '</a></div>'
          }
        ]
      };
      annos.push(anno);
    });
    return annos;
  };

  function csvMaxVal(csvString) {
    var csvArr = $.csv.toArrays(csvString, {separator: ';'});
    var numArr = [].concat.apply([], csvArr).map(x => +x).filter(y => !Number.isNaN(y)); // converts 2d array to 1d numeric array
    return Math.max(... numArr);
  }

  $.get(csvFile, function(csvData) {

    options.data.csv = csvData;
    options.annotations = mkAnnos(quotes['sk'], csvMaxVal(csvData));

    var chart = Highcharts.chart('container', options);
    chart.setSize(undefined, window.innerHeight || document.documentElement.clientHeight);

  });


});
