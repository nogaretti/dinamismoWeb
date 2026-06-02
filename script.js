const urlAPI = "https://jsonplaceholder.typicode.com";

let postsGlobal = [];
let usersGlobal = [];

async function buscarRota(url) {
    const res = await fetch(url);

    if (res.ok) {
        return await res.json();
    }
}

async function buscarPostUsers() {

    usersGlobal = await buscarRota(urlAPI + "/users");
    postsGlobal = await buscarRota(urlAPI + "/posts");
    const limite = 10;

    renderizarPosts(1);

    const quantidadeTelas = Math.ceil(postsGlobal.length / limite);
    for (let y = 1; y <= quantidadeTelas; y++){
        document.getElementById("paginas").innerHTML += "<button onclick='renderizarPosts(" + y + ")'>" + y + "</button>";
    }
}

function renderizarPosts(paginaAtual) {
    const elemento = document.getElementById("elemento");
    const limite = 10;

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
        elemento.innerHTML +=
            "<div class='card'>" +
                "<h2>" + post.title + "</h2>" +
                "<h3>" + userName + "</h3>" +
                "<div>" + post.body + "</div>" +
                "<br>" +
                "<button onclick='editarPost(" + post.id + ")'>" +
                    "Editar" +
                "</button>" +
                "<button onclick='excluirPost(" + post.id + ")'>" +
                    "Excluir" +
                "</button>" +
            "</div>";
    }
}

buscarPostUsers();

function excluirPost(id) {
    alert("Você deseja apagar esse post?")
    postsGlobal = postsGlobal.filter(
        post => post.id !== id
    );

    renderizarPosts(1);
}

function editarPost(id) {

    const post = postsGlobal.find(
        p => p.id === id
    );

    const novoTitulo = prompt(
        "Novo título:",
        post.title
    );

    const novoConteudo = prompt(
        "Novo conteúdo:",
        post.body
    );

    if (
        novoTitulo !== null &&
        novoUsername !== null &&
        novoConteudo !== null
    ) {

        post.title = novoTitulo;
        post.username = novoUsername;
        post.body = novoConteudo;

        renderizarPosts(1);
    }
}