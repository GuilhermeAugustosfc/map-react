import React from 'react';
import {
    ListItemIcon,
    ListItemText,
    ListItem,
    IconButton,
    Typography,
    Toolbar,
    AppBar,
    List,
    Button,
    SwipeableDrawer
} from '@material-ui/core';

import { Link } from 'react-router-dom'

import { GoCalendar, GoGrabber, GoGlobe, GoFileMedia, GoNote } from 'react-icons/go'

import "./Menu.css"


export default function Menu({ children }) {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(open);
    };

    const NavBar = () => (
        <AppBar position="fixed" id="navbar">
            <Toolbar>
                <IconButton onClick={toggleDrawer(true)} edge="start" color="inherit" aria-label="menu">
                    <GoGrabber />
                </IconButton>
                <Typography variant="h6" className="title-nav">
                    Agro
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    )


    const MenuLateral = () => (
        <div
            className="menu-lateral"
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List id='title-menu-lateral'>
                <Typography variant="h6">
                    Agro
                </Typography>
            </List>
            <List>
                <ListItem button key={'mapa'}>
                    <ListItemIcon> 
                        <GoGlobe color={'green'} size={25} /> 
                    </ListItemIcon>
                    <Link to="/mapa" className="link-menu">
                        <ListItemText primary={'MAPA'} />
                    </Link>
                </ListItem>
            </List>
            <List>
                <ListItem button key={'ordemservico'}>
                    <ListItemIcon> 
                        <GoCalendar color={'black'} size={25} /> 
                    </ListItemIcon>
                    <Link to="/cadastros/ordemservico" className="link-menu">
                        <ListItemText primary={'ORDEM DE SERVIÇO'} />
                    </Link>
                </ListItem>
            </List>
            <List>
                <ListItem button key={'talhao'}>
                    <ListItemIcon> 
                        <GoFileMedia color={'darkblue'} size={25} /> 
                    </ListItemIcon>
                    <Link to="/cadastros/talhao" className="link-menu">
                        <ListItemText primary={'TALHÃO'} />
                    </Link>
                </ListItem>
            </List>
            <List>
                <ListItem button key={'tabela'}>
                    <ListItemIcon> 
                        <GoNote color={'black'} size={25} /> 
                    </ListItemIcon>
                    <Link to="/tabela" className="link-menu">
                        <ListItemText primary={'TABELA'} />
                    </Link>
                </ListItem>
            </List>
        </div>
    )
    return (
        <div>
            <React.Fragment key={'left'}>
                <NavBar />
                <SwipeableDrawer
                    anchor={'left'}
                    open={open}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                >
                    <MenuLateral />
                </SwipeableDrawer>

                <div className="container-app">
                    {children}
                </div>
            </React.Fragment>
        </div>
    );
}
