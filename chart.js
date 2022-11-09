let myChart

const plotaGrafico = (humores) => {
  if(myChart) myChart.destroy()
  myChart = new Chart(document.getElementById('myChart'), makeConfig(humores))
}

const updateGrafico = (humores) => {
  myChart.data.datasets = getLast7DaysHumors(getLast7DaysDates(), humores)
  myChart.update()
}

export { plotaGrafico, updateGrafico }

const makeConfig = (humores) => ({
  type: 'line',
  data: getGraphicData(humores),
  options: {}
})

const getGraphicData = (humores)=> ({
  labels: getLast7DaysDatesInStringFormat(),
  datasets: [{
    label: 'Humor médio',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: getLast7DaysHumors(getLast7DaysDates(), humores),
  }]
});

const getLast7DaysDates = () => { 
  let data = new Date()
  data = new Date(data.setDate(data.getUTCDate()-7))
  const last7Days = []
  for(let i =0; i<7; i++) {
    last7Days.push(data);
    data = new Date(data.setDate(data.getUTCDate()+1));
  }
  return last7Days
}

const getLast7DaysDatesInStringFormat = () => {
  let data = new Date()
  data = new Date(data.setDate(data.getUTCDate()-7))
  const last7Days = []
  for(let i =0; i<7; i++) {
    const dia = data.getUTCDate() + 1
    const diaF = (dia.length == 1) ? '0'+dia : dia
    const mes = (data.getMonth()+1).toString() //+1 pois no getMonth Janeiro começa com zero.
    const mesF = (mes.length == 1) ? '0'+mes : mes
    last7Days.push(diaF+"/"+mesF)
    data = new Date(data.setDate(data.getUTCDate()+1));
  }
  return last7Days
}

const getLast7DaysHumors = (last7Days, humores) => {
  const result = []
  for(let i =0; i<7; i++) {
    const humoresNoDia = humores.filter((humor) => compareDates(last7Days[i], humor.data));
    let sum = 0;
    for(let i = 0; i < humoresNoDia.length; i++ ){
      sum += parseInt(humoresNoDia[i].humor, 10);
    }
    let avg = sum/humoresNoDia.length;
    result.push(avg)
  }
  return result
}

const compareDates = (date1, date2) => {
  date1 = new Date(date1)
  date2 = new Date(date2)
  return date1.getUTCDate() === date2.getUTCDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getYear() === date2.getYear()
}