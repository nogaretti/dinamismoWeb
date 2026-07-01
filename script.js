const urlAPI = "https://jsonplaceholder.typicode.com";

let postsGlobal = [];
let usersGlobal = [];
let postEditando = null;
const limite = 10;
let criandoNovoPost = false;
let termoBusca = "";
let ordenacaoAtual = "recentes";
let ultimoExcluido = null;
let timeoutToast = null;

async function buscarRota(url) {
    const res = await fetch(url);

    if (res.ok) {
        return await res.json();
    }
}

async function buscarPostUsers() {
    document.getElementById("carregando").classList.remove("oculto")
    usersGlobal = await buscarRota(urlAPI + "/users");
    postsGlobal = await buscarRota(urlAPI + "/posts");

    renderizarPosts(1);
}
function obterListaFiltrada() {
    let lista = postsGlobal.filter(
        post => post.title.toLowerCase().includes(termoBusca.toLowerCase())
    );

    if (ordenacaoAtual === "recentes") {
        lista = lista.slice().sort((a, b) => b.id - a.id);
    } else if (ordenacaoAtual === "antigos") {
        lista = lista.slice().sort((a, b) => a.id - b.id);
    } else if (ordenacaoAtual === "az") {
        lista = lista.slice().sort((a, b) => a.title.localeCompare(b.title));
    }

    return lista;
}
function atualizarTelas(paginaAtual){
    const quantidadeTelas = Math.ceil(postsGlobal.length / limite);
    document.getElementById("paginas").innerHTML = ""
    for (let y = 1; y <= quantidadeTelas; y++){
        console.log(y);
        document.getElementById("paginas").innerHTML += `
        <button
            class="btn-pages ${y === paginaAtual ? "active" : ""}" 
            onclick="renderizarPosts(${y})">
            ${y} 
        </button>
        `;
    }
}

function renderizarPosts(paginaAtual) {
    const elemento = document.getElementById("elemento");

    let inicio = (paginaAtual - 1) * limite;
    let fim = inicio + limite;
    let postsRegistrados = 0;

    elemento.innerHTML = "";
    for (inicio; inicio < fim; inicio++) {
        const post = postsGlobal[inicio];

        const userCarac = usersGlobal.find(
            u => u.id === post.userId
        );

        const userName = userCarac.username;

        if (postEditando === post.id){
            elemento.innerHTML += `
                <div class="card">
                    <h2 
                        contenteditable="true"
                        class="editando"
                        id="titulo-${post.id}"
                    >
                        ${post.title}
                    </h2>

                    <h3>${userName}</h3>

                    <div 
                        contenteditable="true"
                        class="editando"
                        id="conteudo-${post.id}"
                    >
                        ${post.body}
                    </div>

                    <div class="acoes">
                        <button
                            class="btn-salvar"
                            onclick="salvarPost(${post.id}, ${paginaAtual})"
                        >
                            <i class="fa-solid fa-check"></i>
                        </button>
                        <button
                            class="btn-cancelar"
                            onclick="cancelarAcao(${post.id}, ${paginaAtual})"
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>
            `;
        }else{
            elemento.innerHTML += `
                <div class="card">
                    <h2 id="titulo-${post.id}">
                        ${post.title}
                    </h2>

                    <h3>${userName}</h3>

                    <div id="conteudo-${post.id}">
                        ${post.body}
                    </div>

                    <div class="acoes">
                        <button
                            class="btn-editar"
                            onclick="editarPost(${post.id}, ${paginaAtual})"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button
                            class="btn-excluir"
                            onclick="excluirPost(${post.id}, ${paginaAtual})"
                        >
                            <i class='fa-solid fa-trash'></i>
                        </button>
                    </div>
                </div>
            `;
        }
    }

    atualizarTelas(paginaAtual);
}
document.getElementById("contadorPosts").textContent = `${listaFiltrada.length} posts`;
function excluirPost(id, paginaAtual) {
    const resposta = confirm("Você deseja apagar esse post?");
    if (resposta) {
        postsGlobal = postsGlobal.filter(
            post => post.id !== id
        );
        renderizarPosts(paginaAtual);
    }
}

function editarPost(id, paginaAtual) {
    postEditando = id;
    renderizarPosts(paginaAtual);
}

function cancelarAcao(id, paginaAtual){
    postEditando = null;
    renderizarPosts(paginaAtual);
}

function salvarPost(id, paginaAtual){
    const post = postsGlobal.find(
        p => p.id === id
    );

    const novoTitulo = document.getElementById(`titulo-${id}`).textContent;
    const novoConteudo = document.getElementById(`conteudo-${id}`).textContent;

    if (
        novoTitulo !== null &&
        novoConteudo !== null
    ) {
        post.title =
        document.getElementById(`titulo-${id}`).innerText;
        post.body =
        document.getElementById(`conteudo-${id}`).innerText;

        postEditando = null;
        renderizarPosts(paginaAtual);
    }
}
document.getElementById("novoPost").addEventListener("click", function() {
    if (criandoNovoPost) return;
 
    criandoNovoPost = true;
    postEditando = null;
 
    const opcoesUsuarios = usersGlobal
        .map(u => `<option value="${u.id}">${u.username}</option>`)
        .join("");
 
    const elemento = document.getElementById("elemento");
 
    const card = document.createElement("div");
    card.className = "card";
    card.id = "card-novo-post";
    card.innerHTML = `
        <h2
            contenteditable="true"
            class="editando"
            id="titulo-novo"
        ></h2>
 
        <select id="opcoesUsuarios">
            ${opcoesUsuarios}
        </select>
 
        <div
            contenteditable="true"
            class="editando"
            id="conteudo-novo"
        ></div>
 
        <div class="acoes">
            <button class="btn-salvar" onclick="confirmarNovoPost()">
                <i class="fa-solid fa-check"></i>
            </button>
            <button class="btn-cancelar" onclick="cancelarNovoPost()">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `;
 
    elemento.insertBefore(card, elemento.firstChild);
    document.getElementById("titulo-novo").focus();
});
 
function confirmarNovoPost() {
    const titulo = document.getElementById("titulo-novo").innerText.trim();
    const conteudo = document.getElementById("conteudo-novo").innerText.trim();
    const userId = parseInt(document.getElementById("opcoesUsuarios").value);
 
    if (!titulo || !conteudo) {
        alert("Preencha o título e o conteúdo antes de salvar.");
        return;
    }
 
    const maiorId = postsGlobal.reduce((max, p) => p.id > max ? p.id : max, 0);
 
    const novoPost = {
        id: maiorId + 1,
        userId: userId,
        title: titulo,
        body: conteudo,
    };
 
    postsGlobal.unshift(novoPost);
    criandoNovoPost = false;
    renderizarPosts(1);
}
 
function cancelarNovoPost() {
    criandoNovoPost = false;
    const card = document.getElementById("card-novo-post");
    if (card) card.remove();
}
 
buscarPostUsers();
