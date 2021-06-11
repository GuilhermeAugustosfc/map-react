import React, { useState } from "react";
import { useHistory } from "react-router";
import {
  BackImage,
  Container,
  ContainerLogin,
  InputsLogin,
  ContainerInputs,
  ButtonLogin,
  ContainerLogo
} from "./styles";
import "./index.css";
import UncontrolledLottie from "./animation";
import api from "../../services/api"
import Swal from "sweetalert2";
import LocalStorage from '../../services/storage'


function Login() {
  const [senha, setSenha] = useState("")
  const [email, setEmail] = useState("")

  const history = useHistory()

  function validaLogin(e = null) {
    if (senha !== "" && email !== "") {
      let dados = new FormData();
      dados.append("email", email);
      dados.append("senha", senha);
      api.post("/Login/loginIndice", dados, ({ data }) => {
        if (data.status) {
          LocalStorage.setStorage(data.data)
          history.push(`/painel`);
        } else {
          e.preventDefault();
          Swal.fire(
            "Atenção !",
            "Login ou senha incorretos !",
            "warning"
          );
        }
      })
    } else {
      e.preventDefault();
      Swal.fire(
        "Atenção !",
        "Login e senha obrigatórios !",
        "warning"
      );
    }
  }

  return (
    <BackImage>
      <Container>
        <ContainerLogin>

          <ContainerLogo >
            <div> <UncontrolledLottie /> </div>
            <div> F/ Agro  </div>
          </ContainerLogo>

          <ContainerInputs>
            <InputsLogin type="email" placeholder="Digite seu login" onKeyDown={(e) => (e.key === 'Enter') ? validaLogin(e) : ""} onChange={(e) => setEmail(e.target.value)}></InputsLogin>
          </ContainerInputs>

          <ContainerInputs>
            <InputsLogin type="password" placeholder="Digite sua senha" onKeyDown={(e) => (e.key === 'Enter') ? validaLogin(e) : ""} onChange={(e) => setSenha(e.target.value)}></InputsLogin>
          </ContainerInputs>

          <ContainerInputs>
            <ButtonLogin type="button" onClick={(e) => validaLogin(e)} >Login</ButtonLogin>
          </ContainerInputs>
        </ContainerLogin>
      </Container>
    </BackImage>
  );
}

export default Login;
