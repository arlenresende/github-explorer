import React, { useState, FormEvent, useEffect} from 'react'

import api from '../../services/api'
import {Link} from 'react-router-dom'

import { FiChevronRight } from 'react-icons/fi';

import logoImg from '../../assets/logo.svg';
import {Title, Form, Repositories, Error} from './styles';

interface Repository {
    full_name: string,
    description:  string,
    owner: {
        login: string,
        avatar_url: string
    },

}

const Dashboard: React.FC = () => {

    const [newRepo, setnewRepo] = useState('');
    const [inputError, setInputError] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');

        if (storagedRepositories){
            return JSON.parse(storagedRepositories);
        }else{
            return [];
        }

    });

    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
    },[repositories]);


    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void>{
        // Adição novo Repositorio
        event.preventDefault();

        if (!newRepo){
            setInputError('É necessário digitar um nome/repositório para busca');
            return;
        }
        
       try {
            const response = await api.get<Repository>(`repos/${newRepo}`);
            
            const repository = response.data;

            setRepositories([ ...repositories, repository]);
            setnewRepo('');
            setInputError('');
       } catch (error) {
            setInputError('Não foi possível acessar o Repositório desejado');
       }
        
    }


    return (
        <>
        <img src={logoImg} alt="GitHub Explorer" />
        <Title>Explore Repositorios no GitHub</Title>

        <Form hasError={!!inputError} onSubmit={handleAddRepository}>
            <input 
            type="text" 
            placeholder="Digite o nome do Repositório"
            value={newRepo}
            onChange={ (e) => setnewRepo(e.target.value)}
            
            
            />
            <button type="submit">Pesquisar</button>
        </Form>
        { inputError && <Error>{inputError}</Error> }
        <Repositories>
            {repositories.map(repository => (
                <Link key={repository.full_name} to={`repository/${repository.full_name}`}>
                    <img src={repository.owner.avatar_url} alt={repository.owner.login} />
                    <div>
                        <strong>{repository.full_name}</strong>
                        <p>{repository.description}</p>
                    </div>
                    <FiChevronRight size={20} />
                </Link>
            ))
           }

         

        </Repositories>
        </>
    )
};

export default Dashboard;