import React, { useEffect } from 'react'


const Tabela = function () {
    useEffect(() => {
        console.log('request dados tabela');
    }, [])
    return <h1>Tabela consolidado</h1>
}


export default Tabela;