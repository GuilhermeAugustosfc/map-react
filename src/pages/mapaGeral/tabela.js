import React, { useEffect, useState } from 'react'
import './tabela.css'
function Tabela({ dados, onHoverRow }) {
    const [offset, setOffiset] = useState(0);
    const [limit, setLimit] = useState(15);
    const [dadosVisiveis, setDadosVisiveis] = useState([]);
    const [todosDados, setTodosDados] = useState([]);

    const paginacao = 50;

    useEffect(() => {
        setDadosVisiveis(dados.slice(offset, limit))
        setTodosDados(dados)
    }, [dados])

    function onScrollTable() {
        let elementLast = document.querySelector(`.linha_${limit}`);
        if (!elementLast) {
            setDadosVisiveis((value) => [...value, ...todosDados.slice(limit + 1, limit + paginacao)]);
        } else if (elementLast && isVisible(elementLast)) {
            setDadosVisiveis((value) => [...value, ...todosDados.slice(limit + 1, limit + paginacao)]); 
            setOffiset(limit + 1)
            setLimit((limit) => limit + paginacao);
        }
    }

    function isVisible(elem) {
        if (!(elem instanceof Element)) throw Error('DomUtil: elem is not an element.');
        const style = getComputedStyle(elem);
        if (style.display === 'none') return false;
        if (style.visibility !== 'visible') return false;
        if (style.opacity < 0.1) return false;
        if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
            elem.getBoundingClientRect().width === 0) {
            return false;
        }
        const elemCenter   = {
            x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
            y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
        };
        if (elemCenter.x < 0) return false;
        if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
        if (elemCenter.y < 0) return false;
        if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
        let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
        try {
            do {
                if (pointContainer === elem) return true;
            } while (pointContainer = pointContainer.parentNode);
        } catch (error) {
            console.log('----------erroor --------------');
        }
        return false;
    }

    return (
        <table className="tabela" onScroll={() => onScrollTable()}>
            <thead>
                <tr>
                    <th>A</th>
                    <th>B</th>
                    <th>C</th>
                    <th>D</th>
                    <th>E</th>
                </tr>
            </thead>
            <tbody>
                {dadosVisiveis.map((data, index) => (
                    <tr className={`linha_${index + 1}`} onMouseOver={() => onHoverRow(data)} key={index}>
                        <td>a</td>
                        <td>b</td>
                        <td>v</td>
                        <td>c</td>
                        <td>{index + 1}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Tabela