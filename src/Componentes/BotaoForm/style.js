import styled from 'styled-components';

const Container = styled.div`
    display:flex;
`;

const ButtonForm = styled.button`
    width: 3em;
    border-radius: 4px;
    margin-left: 0.5em;
    margin-bottom: 0.6em;
    border: solid 2px ${props => props.corBotao};
    -webkit-text-emphasis: filled;
    background-color: ${props => props.corBotao};
    color: #ffffff;

    &:hover{
        background-color: #FFF;
        border: solid 2px ${props => props.corBotao};
    }

    &:hover  > *{
        color:${props => props.corBotao};
    }

    &:active {
        background-color: #FFF;
        border: solid 2px ${props => props.corBotao};
    }


`;
export { Container, ButtonForm }
