const urlAPI = "https://jsonplaceholder.typicode.com";

let postsGlobal = [];
let usersGlobal = [];
let postEditando = null;
const limite = 10;

async function buscarRota(url) {
    const res = await fetch(url);

    if (res.ok) {
        return await res.json();
    }
}

async function buscarPostUsers() {

    usersGlobal = await buscarRota(urlAPI + "/users");
    postsGlobal = await buscarRota(urlAPI + "/posts");

    renderizarPosts(1);
}

function atualizarTelas(){
    const quantidadeTelas = Math.ceil(postsGlobal.length / limite);
    document.getElementById("paginas").innerHTML = ""
    for (let y = 1; y <= quantidadeTelas; y++){
        document.getElementById("paginas").innerHTML += "<button onclick='renderizarPosts(" + y + ")'>" + y + "</button>";
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

    atualizarTelas();
}

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

buscarPostUsers();