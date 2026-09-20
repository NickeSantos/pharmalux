const form = document.getElementById('form-contato');
const confirmacao = document.getElementById('form-confirmacao');

const validadores = {
  nome: (valor) => valor.trim().length >= 3 ? '' : 'Digite seu nome completo',
  email: (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor) ? '' : 'Digite um e-mail válido',
  assunto: (valor) => valor !== '' ? '' : 'Selecione um assunto',
  mensagem: (valor) => valor.trim().length >= 10 ? '' : 'Escreva pelo menos 10 caracteres'
};

function validarCampo(nomeCampo) {
  const campo = document.getElementById(nomeCampo);
  const grupo = campo.closest('.campo-grupo');
  const spanErro = document.getElementById(`erro-${nomeCampo}`);

  const mensagemErro = validadores[nomeCampo](campo.value);

  grupo.classList.toggle('campo-invalido', mensagemErro !== '');
  spanErro.textContent = mensagemErro;

  return mensagemErro === '';
}

form.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const camposValidos = Object.keys(validadores).map(validarCampo);
  const formularioValido = camposValidos.every(valido => valido === true);

  if (formularioValido) {
    confirmacao.hidden = false;
    form.reset();
    document.querySelectorAll('.campo-invalido').forEach(grupo => {
      grupo.classList.remove('campo-invalido');
    });
  } else {
    confirmacao.hidden = true;
  }
});

Object.keys(validadores).forEach(nomeCampo => {
  const campo = document.getElementById(nomeCampo);
  campo.addEventListener('blur', () => validarCampo(nomeCampo));
});
