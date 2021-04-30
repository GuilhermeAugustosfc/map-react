
import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

// import Login from "./Telas/Login/Login"

import Menu from "./Componentes/Menu/Menu"


import Relatorio from "./pages/Relatorio";

import TalhaoTabela from "./pages/Cadastros/Talhao/tabela";
import TalhaoForm from "./pages/Cadastros/Talhao/form";

import OrdemServicoTabela from "./pages/Cadastros/OrdemServico/tabela";
import OrdemServicoForm from "./pages/Cadastros/OrdemServico/form";

import Mapa from "./pages/MapaGeral";
import PainelOs from "./pages/PainelOs";

import isLogged from "./validacao/routerValidacao"

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={(props) => (
        isLogged() ? (
            <Menu>
                <Component {...props} />
            </Menu>
        ) : 
            <Redirect to="/login" />
        )}/>
    )

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <PrivateRoute exact path="/" component={(props) => <PainelOs {...props} />} />
            {/* <Route exact path="/login" component={Login} /> */}

            <PrivateRoute exact path="/cadastros/talhao" component={(props) => <TalhaoTabela {...props} />} />
            <PrivateRoute exact path="/cadastros/talhao/form" component={(props) => <TalhaoForm {...props} />} />
            <PrivateRoute exact path="/cadastros/talhao/form/:id" component={(props) => <TalhaoForm {...props} />} />

            <PrivateRoute exact path="/cadastros/ordemservico" component={(props) => <OrdemServicoTabela {...props} />} />
            <PrivateRoute exact path="/cadastros/ordemservico/form" component={(props) => <OrdemServicoForm {...props} />} />
            <PrivateRoute exact path="/cadastros/ordemservico/form/:id" component={(props) => <OrdemServicoForm {...props} />} />

            <PrivateRoute exact path="/mapa" component={(props) => <Mapa {...props} />} />
            <PrivateRoute exact path="/mapa/:id" component={(props) => <Mapa {...props} />} />
            <PrivateRoute exact path="/relatorio" component={(props) => <Relatorio {...props} />} />
            
            <PrivateRoute path="*" component={() => <h1>Pagina não encontrada</h1>} />
        </Switch>
    </BrowserRouter>
)


export default Routes;