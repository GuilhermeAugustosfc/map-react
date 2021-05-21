import styled from "styled-components";
import img from "../../midia/login.jpg";

const BackImage = styled.div`
  background-image: url(${img});
  background-repeat: no-repeat;
  background-size: cover;
  background-position-x: center;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  height: inherit;
  color: white;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
`;

const ContainerLogin = styled.div`
  background-color: rgb(228, 228, 228);;
  height: 25rem;
  width: 22rem;
  padding: 1em;
  display: flex;
  flex-direction: column;
  border-radius: 0.7em;
`;

const ContainerInputs = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: ${(props) => props.height};
  padding: 0.3em;
  margin: 1.7em 1em 0em 1em;
`;

const InputsLogin = styled.input`
  padding: 4px 8px;
  border-style: solid;
  border-width: 2px;
  border-color: rgba(0, 0, 0, 0.4);
  background-color: rgba(255, 255, 255, 0.4);
  height: 32px;
  height: 2rem;
  padding: 6px 10px;
  border-width: 1px;
  border-color: #666;
  border-color: rgba(0, 0, 0, 0.6);
  height: 36px;
  outline: none;
  border-radius: 0;
  -webkit-border-radius: 0;
  background-color: transparent;
  border-top-width: 0;
  border-left-width: 0;
  border-right-width: 0;
  padding-left: 0;
`;

const ButtonLogin = styled.button`
  border-radius: 4px;
  width: 75%;
  padding: 0.2em;
`;

const ContainerLogo = styled.div`
  height: ${(props) => props.height};
  padding: 0.3em;
  text-align: center;
`;
export {
  BackImage,
  Container,
  ContainerLogin,
  InputsLogin,
  ContainerInputs,
  ButtonLogin,
  ContainerLogo
};
