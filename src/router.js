
import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

// import Login from "./Telas/Login/Login"

// import Menu from "./Menu/menu"

// import Dashboard from "./Telas/Dashboard/dashboard"

import Tabela from "./pages/Tabela"

import Mapa from "./pages/mapaGeral"

import isLogged from "./validacao/routerValidacao"

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={(props) => (
        isLogged() ? (
            <Component {...props} />
        ) : 
            <Redirect to="/login" />
        )}/>
    )

const Routes = () => (
    <BrowserRouter>
        <Switch>
            {/* <Route exact path="/" component={Login} /> */}
            {/* <PrivateRoute exact path="/mapa" component={(props) => <Menu><VendedorTabela {...props} /></Menu>} />
            <PrivateRoute exact path="/tabela" component={(props) => <Menu><VendedorForm {...props} /></Menu>} /> */}

            <PrivateRoute exact path="/mapa" component={(props) => <Mapa {...props} />} />
            <PrivateRoute exact path="/mapa/:id" component={(props) => <Mapa {...props} />} />
            <PrivateRoute exact path="/tabela" component={(props) => <Tabela {...props} />} />
            
            <PrivateRoute path="*" component={() => <h1>Pagina não encontrada</h1>} />
        </Switch>
    </BrowserRouter>
)


export default Routes;