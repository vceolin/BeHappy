
import { plotaGrafico, updateGrafico } from './chart.js'

let humores = [];
let emojiDictionary = ['', '😭', '😟', '😐', '😊' ,'🤩']

const formatDate = (data) => {
  data = new Date(data)
  const dia = data.getUTCDate()
  const diaF = (dia.length == 1) ? '0'+dia : dia
  const mes = (data.getMonth()+1).toString() //+1 pois no getMonth Janeiro começa com zero.
  const mesF = (mes.length == 1) ? '0'+mes : mes
  const anoF = data.getFullYear()
  return diaF+"/"+mesF+"/"+anoF
}

Date.prototype.toDateInputValue = (function() {
  var local = new Date(this);
  return local.toJSON().slice(0,10);
});

onload = () => {
  document.getElementById('inputDate').value = new Date().toDateInputValue();
  document.getElementById('inputHumor').value = 3;

  const t = JSON.parse(localStorage.getItem('humores'));
  if (t) humores = t;
  mostraHumores();
  document.querySelector('#inputHumor').oninput = monitoraCampoAdic;
  document.querySelector('#inputAlteraHumor').oninput = monitoraCampoAlt;
  
  document.querySelector('#inputHumor').onkeypress = (e) => {if (e.key == 'Enter') adicionaHumor();};
  document.querySelector('#inputDate').onkeypress = (e) => {if (e.key == 'Enter') adicionaHumor();};
  document.querySelector('#inputDescHumor').onkeypress = (e) => {if (e.key == 'Enter') adicionaHumor();};
  document.querySelector('#inputAlteraHumor').onkeypress = (e) => {if (e.key == 'Enter') alteraHumor();};
  document.querySelector('#inputAlteraDate').onkeypress = (e) => {if (e.key == 'Enter') alteraHumor();};
  document.querySelector('#inputAlteraDescHumor').onkeypress = (e) => {if (e.key == 'Enter') alteraHumor();};

  document.querySelector('#btnAdic').onclick = () => {
    ativa('tela2');
    document.querySelector('#inputHumor').focus();
  };

  document.querySelector('#btnCanc1').onclick = () => {
    document.querySelector('#inputHumor').value = '';
    ativa('tela1');
  };

  document.querySelector('#btnCanc2').onclick = () => {
    let campo = document.querySelector('#inputAlteraHumor');
    campo.value = '';
    campo.removeAttribute('data-id');
    ativa('tela1');
  };

  document.querySelector('#btnInc').onclick = () => {adicionaHumor();};
  document.querySelector('#btnAlt').onclick = () => {alteraHumor();};
  document.querySelector('#btnDel').onclick = () => {apagaHumor();};
};

const mostraHumores = () => {
  plotaGrafico(humores)
  const listaDeHumores = document.querySelector('#listaDeHumores');
  listaDeHumores.innerHTML = '';
  //ordena por data
  humores.sort(function(a,b){
    return new Date(b.data) - new Date(a.data);
  });
  humores.forEach((humor) => {
    let elemHumor = document.createElement('li');
    let emoji = emojiDictionary[humor.humor]
    elemHumor.innerHTML = `${formatDate(humor.data)} ${emoji}: ${humor.descricao}`;
    elemHumor.setAttribute('data-id', humor.id);
    elemHumor.onclick = () => {
      let campoHumor = document.querySelector('#inputAlteraHumor');
      let campoDescHumor = document.querySelector('#inputAlteraDescHumor');
      let campoDate = document.querySelector('#inputAlteraDate');
      ativa('tela3');
      campoHumor.value = humor.humor;
      campoDescHumor.value = humor.descricao;
      console.log(humor.data)
      campoDate.value = new Date(new Date(humor.data)).toDateInputValue()
      campoHumor.setAttribute('data-id', humor.id);
    };
    listaDeHumores.appendChild(elemHumor);
  });
  document.querySelector('#estado').innerText = humores.length;
  if (humores.length > 0) {
    listaDeHumores.classList.remove('hidden');
    document.querySelector('#blank').classList.add('hidden');
  } else {
    listaDeHumores.classList.add('hidden');
    document.querySelector('#blank').classList.remove('hidden');
  }
};

const ativa = (comp) => {
  let listaDeTelas = document.querySelectorAll('body > .component');
  listaDeTelas.forEach((c) => c.classList.add('hidden'));
  document.querySelector('#' + comp).classList.remove('hidden');
};

const adicionaHumor = () => {
  let campoHumor = document.querySelector('#inputHumor');
  let campoDescHumor = document.querySelector('#inputDescHumor');
  let campoDate = document.querySelector('#inputDate');
  humores.push({
    id: Math.random().toString().replace('0.', ''),
    humor: campoHumor.value,
    descricao: campoDescHumor.value,
    data: new Date(campoDate.value)
  });
  campoHumor.value = 3;
  campoDescHumor.value = '';
  campoDate.value = new Date().toDateInputValue();
  ativa('tela1');
  salvaHumores();
  mostraHumores();
};

const alteraHumor = () => {
  let campoHumor = document.querySelector('#inputAlteraHumor');
  let campoDescHumor = document.querySelector('#inputAlteraDescHumor');
  let campoDate = document.querySelector('#inputAlteraDate');
  let idHumor = campoHumor.getAttribute('data-id');
  let i = humores.findIndex((humor) => humor.id === idHumor);
  humores[i].humor = campoHumor.value;
  humores[i].data = campoDate.value;
  humores[i].descricao = campoDescHumor.value;

  campoHumor.value = 3;
  campoDescHumor.value = '';
  campoDate.value = new Date().toDateInputValue();
  campoHumor.removeAttribute('data-id');
  ativa('tela1');
  salvaHumores();
  mostraHumores();
};

const apagaHumor = () => {
  let campo = document.querySelector('#inputAlteraHumor');
  let idHumor = campo.getAttribute('data-id');
  humores = humores.filter((t) => t.id != idHumor);
  campo.value = '';
  campo.removeAttribute('data-id');
  ativa('tela1');
  salvaHumores();
  mostraHumores();
};

const salvaHumores = () => {
  localStorage.setItem('humores', JSON.stringify(humores));
};

const monitoraCampoAdic = (e) => {
  let botao = document.querySelector('#btnInc');
  botao.disabled = false;
};

const monitoraCampoAlt = (e) => {
  let botao = document.querySelector('#btnAlt');
  if (e.target.value.length > 0) botao.disabled = false;
  else botao.disabled = true;
};

navigator.serviceWorker.register('./behappy-sw.js');