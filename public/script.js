
// MAPEAMENTO DOS NOMES DE EXIBIÇÃO
const columnMapping = {
    'ID': 'id',
    'E-mail': 'email',
    'Nome': 'name',
};

async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:3333/api/users');
        const { users } = await response.json();

        const table = document.getElementById('user-table');
        table.innerHTML = '';

        if (users && users.length > 0) {
            const headerRow = table.insertRow(0);

            for (const columnName in columnMapping) {
                const th = document.createElement('th');
                th.textContent = columnName;
                headerRow.appendChild(th);
            }

            headerRow.innerHTML += '<th>Ações</th>';

            users.forEach((user) => {
                const row = table.insertRow();

                // USA NOME DE CHAVES MAPEADOS
                for (const columnName in columnMapping) {
                    const cell = row.insertCell();
                    cell.textContent = user[columnMapping[columnName]];
                }

                // ADICIONA BOTÕES EXCLUIR / EDITAR
                const actionsCell = row.insertCell();
                actionsCell.innerHTML = `
                      <button onclick="editUser(${user.id})">Editar</button>
                      <button onclick="deleteUser(${user.id})">Excluir</button>
                  `;
            });
        }
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
}


// FUNCÃO EDITAR USUÁRIO
window.editUser = async function (userId) {
    try {
        const response = await fetch(`http://localhost:3333/api/users/${userId}`);

        if (!response.ok) {
            throw new Error(`Erro ao obter dados do usuário para edição: ${response.statusText}`);
        }

        const userData = await response.json();

        // PREENCHE OS DADOS PARA EDIÇÃO NO MODAL
        document.getElementById('editName').value = userData.user.name;
        document.getElementById('editEmail').value = userData.user.email;

        document.getElementById('editModal').setAttribute('data-user-id', userId);

        document.getElementById('editModal').style.display = 'block';

    } catch (error) {
        console.error('Erro ao obter dados do usuário para edição:', error);
    }
}

// FUNÇÃO SALVAR USUÁRIOS EDITADOS
window.saveEditedUser = async function () {
    try {
        const userId = document.getElementById('editModal').getAttribute('data-user-id')

        const editedName = document.getElementById('editName').value;
        const editedEmail = document.getElementById('editEmail').value;

        // VALIDAÇÃO DE NOME COM SOBRENOME
        const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ]+(?: [a-zA-ZÀ-ÖØ-öø-ÿ]+){1,4}$/;
        if (!nameRegex.test(editedName)) {
            alert('Por favor, insira um nome completo válido (nome e sobrenome).');
            return;
        }

        // VALIDAÇÃO DO FORMATO EMAIL
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editedEmail)) {
            alert('Por favor, insira um endereço de e-mail válido.');
            return;
        }

        const response = await fetch(`http://localhost:3333/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: editedName, email: editedEmail }),
        });

        if (!response.ok) {
            throw new Error(`Erro ao atualizar usuário: ${response.statusText}`);
        }

        alert('Usuário atualizado com sucesso!');

        window.closeEditModal();

        fetchUsers();

    } catch (error) {
        console.error('Erro ao salvar alterações do usuário:', error);
    }
}

// FUNÇÃO EXCLUIR DADOS
window.deleteUser = async function (userId) {
    try {
        const response = await fetch(`http://localhost:3333/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro ao excluir usuário: ${response.statusText}`);
        }

        console.log(`Usuário com ID ${userId} excluído com sucesso.`);
        alert('Usuário excluído com sucesso!');

    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
    }
}

// CHAMA fetchUsers DEPOIS DE CARREGAR A PÁGINA
document.addEventListener('DOMContentLoaded', fetchUsers);


// FECHAR O MODAL
window.closeEditModal = function () {
    document.getElementById('editModal').style.display = 'none';
};