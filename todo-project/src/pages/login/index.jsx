import { useState } from 'react';
import './style.css';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export function Login() {
    // Estado para validar se estou logando ou registrando
    const [isRegister, setIsRegister] = useState(false);

    // Estados referentes aos inputs
    const [registration, setRegistration] = useState('');
    const [password, setPassword] = useState('');

    // Estados para gerenciar erros e sucesso
    const [errorApi, setErrorApi] = useState({});
    const [successApi, setSuccessApi] = useState('');
    const navigate = useNavigate();

    // Função para alternar entre login e registro
    function handleChangeContent() {
        setIsRegister(oldValue => !oldValue);
        setErrorApi({}); // Limpa o estado de erro
        handleClearForm();
    }

    // Função para limpar o formulário
    function handleClearForm() {
        setRegistration('');
        setPassword('');
    }

    // Função para realizar o login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username: registration, password });
            localStorage.setItem('token', response.data.token); // Salva o token no localStorage
            navigate('/tasks'); // Redireciona para a página de tarefas
        } catch (error) {
            setErrorApi({ message: error.response?.data?.message || 'Erro ao fazer login' });
            console.error('Erro no login:', error);
        }
    };

    // Função para realizar o registro
    const handleRegister = async () => {
        const registerObject = {
            username: registration, // Aqui, "registration" é usado como "username"
            password: password,
        };

        try {
            const response = await api.post('/auth/register', registerObject);
            setSuccessApi('Registro realizado com sucesso. Faça login.');
            setErrorApi({});

            // Limpa o formulário
            handleClearForm();

            // Alterna para a tela de login
            setIsRegister(false);
        } catch (error) {
            setErrorApi({ message: error.response?.data?.message || 'Ocorreu um erro na sua requisição.' });
            console.error(error);
        }
    };

    return (
        <>
            {isRegister ? (
                // Formulário de Registro
                <div className="container">
                    <div className="form">
                        <h1>Cadastre-se</h1>
                        {errorApi.message && <p className="error">{errorApi.message}</p>}
                        {successApi && <p className="success">{successApi}</p>}
                        <div className="input-wrapper">
                            <label htmlFor="registration">Usuário: </label>
                            <input
                                type="text"
                                name="registration"
                                id="registration"
                                onChange={(event) => setRegistration(event.target.value)}
                                value={registration}
                            />
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="password">Senha: </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                onChange={(event) => setPassword(event.target.value)}
                                value={password}
                            />
                        </div>
                        <button className="btnRegister" type="button" onClick={handleRegister}>
                            Cadastrar
                        </button>
                        <button className="btnClear" type="button" onClick={handleClearForm}>
                            Limpar formulário
                        </button>
                        <p>
                            Já possui cadastro?{' '}
                            <button className="btnChange" onClick={handleChangeContent}>
                                <span>Fazer login</span>
                            </button>
                        </p>
                    </div>
                </div>
            ) : (
                // Formulário de Login
                <div className="container">
                    <div className="form">
                        <h1>Faça o seu Login</h1>
                        {errorApi.message && <p className="error">{errorApi.message}</p>}
                        {successApi && <p className="success">{successApi}</p>}
                        <div className="input-wrapper">
                            <label htmlFor="registration">Usuário: </label>
                            <input
                                type="text"
                                name="registration"
                                id="registration"
                                onChange={(event) => setRegistration(event.target.value)}
                                value={registration}
                            />
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="password">Senha: </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                onChange={(event) => setPassword(event.target.value)}
                                value={password}
                            />
                        </div>
                        <button className="btnSubmit" type="button" onClick={handleLogin}>
                            Logar
                        </button>
                        <p>
                            Não tem cadastro?{' '}
                            <button className="btnChange" onClick={handleChangeContent}>
                                <span>Cadastre-se</span>
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}