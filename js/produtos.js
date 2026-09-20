let todosProdutos = [];
let categoriaAtiva = 'todas';
let termoBusca = '';

const gruposContainer = document.getElementById('grupos-produtos');
const estadoVazio = document.getElementById('estado-vazio');
const campoBusca = document.getElementById('campo-busca');
const chips = document.querySelectorAll('.filtro-chip');

const iconesPorCategoria = {
  'Medicamentos': '💊',
  'Higiene Pessoal': '🧴',
  'Beleza': '💄',
  'Suplementos': '💪',
  'Infantil': '👶',
  'Dermocosmético': '✨',
  'Perfumaria': '🌸'
};

async function carregarProdutos() {
  gruposContainer.innerHTML = '<p class="carregando">Carregando produtos...</p>';

  const resposta = await fetch('data/produtos.json');
  todosProdutos = await resposta.json();

  aplicarCategoriaDaUrl();
  renderizarProdutos();
}

function aplicarCategoriaDaUrl() {
  const parametros = new URLSearchParams(window.location.search);
  const categoriaUrl = parametros.get('categoria');

  if (categoriaUrl) {
    categoriaAtiva = categoriaUrl;
    chips.forEach(chip => {
      chip.classList.toggle('filtro-chip-ativo', chip.dataset.categoria === categoriaUrl);
    });
  }
}

function filtrarProdutos() {
  return todosProdutos.filter(produto => {
    const bateCategoria = categoriaAtiva === 'todas' || produto.categoria === categoriaAtiva;
    const bateBusca = produto.nome_produto.toLowerCase().includes(termoBusca.toLowerCase());
    return bateCategoria && bateBusca;
  });
}

function agruparPorSubcategoria(produtos) {
  const grupos = {};
  produtos.forEach(produto => {
    const chave = produto.subcategoria;
    if (!grupos[chave]) {
      grupos[chave] = { categoria: produto.categoria, itens: [] };
    }
    grupos[chave].itens.push(produto);
  });
  return grupos;
}

function criarMiniCard(produto) {
  const card = document.createElement('article');
  card.className = 'produto-mini-card';

  const icone = iconesPorCategoria[produto.categoria] || '💊';

  card.innerHTML = `
    <span class="produto-mini-icone">${icone}</span>
    <strong>${produto.nome_produto}</strong>
  `;

  return card;
}

function renderizarProdutos() {
  const resultado = filtrarProdutos();
  gruposContainer.innerHTML = '';

  if (resultado.length === 0) {
    estadoVazio.hidden = false;
    return;
  }

  estadoVazio.hidden = true;
  const grupos = agruparPorSubcategoria(resultado);

  Object.keys(grupos).sort().forEach(nomeSubcategoria => {
    const grupo = grupos[nomeSubcategoria];
    const icone = iconesPorCategoria[grupo.categoria] || '💊';

    const secao = document.createElement('div');
    secao.className = 'grupo-subcategoria';

    const cabecalho = document.createElement('div');
    cabecalho.className = 'grupo-cabecalho';
    cabecalho.innerHTML = `
      <span class="grupo-icone">${icone}</span>
      <h3>${nomeSubcategoria}</h3>
      <span>(${grupo.itens.length} produto${grupo.itens.length !== 1 ? 's' : ''})</span>
    `;

    const grade = document.createElement('div');
    grade.className = 'grupo-grid';
    grupo.itens.forEach(produto => grade.appendChild(criarMiniCard(produto)));

    secao.appendChild(cabecalho);
    secao.appendChild(grade);
    gruposContainer.appendChild(secao);
  });
}

campoBusca.addEventListener('input', (evento) => {
  termoBusca = evento.target.value;
  renderizarProdutos();
});

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    categoriaAtiva = chip.dataset.categoria;
    chips.forEach(c => c.classList.remove('filtro-chip-ativo'));
    chip.classList.add('filtro-chip-ativo');
    renderizarProdutos();
  });
});

// Menu mobile (antes vinha do main.js, essa página não carrega mais ele)
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('nav-links-aberto');
  });
}

carregarProdutos();
