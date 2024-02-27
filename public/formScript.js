
async function createUser() {
    try {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ]+(?: [a-zA-ZÀ-ÖØ-öø-ÿ]+){1,4}$/;
        if (!nameRegex.test(name)) {
            alert('Por favor, insira um nome completo válido (nome e sobrenome).');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, insira um endereço de e-mail válido.');
            return;
        }

        const response = await fetch('http://localhost:3333/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
        });

        if (response.status === 201) {
            alert('Usuário criado com sucesso!');
            fetchUsers();
        } else {
            const { message } = await response.json();
            alert(`Erro ao criar usuário: ${message}`);
        }
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
    }
}

