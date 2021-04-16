import React from 'react';
import {
    ListItemIcon,
    ListItemText,
    ListItem,
    IconButton,
    Typography,
    List,
    SwipeableDrawer
} from '@material-ui/core';

import { Link } from 'react-router-dom'

import { GoCalendar, GoGrabber, GoGlobe, GoFileMedia, GoNote, GoDeviceDesktop } from 'react-icons/go'

import "./Menu.css"


export default function Menu({ children }) {
    const [open, setOpen] = React.useState(false);
    const menuRef = React.useRef(null);

    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(open);
    };

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
                <ListItem button key={'dashboard'}>
                    <ListItemIcon>
                        <GoDeviceDesktop color={'black'} size={25} />
                    </ListItemIcon>
                    <Link to="/" className="link-menu">
                        <ListItemText primary={'DASHBOARD'} />
                    </Link>
                </ListItem>
            </List>
            <List>
                <ListItem button key={'mapa'}>
                    <ListItemIcon>
                        <GoGlobe color={'black'} size={25} />
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
                        <GoFileMedia color={'black'} size={25} />
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
        <React.Fragment key={'left'}>
            <IconButton id="menu-navbar" onClick={toggleDrawer(true)} edge="start" color="inherit" aria-label="menu">
                <GoGrabber />
            </IconButton>
            <SwipeableDrawer
                anchor={'left'}
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
            >
                <MenuLateral />
            </SwipeableDrawer>

            <div className="container-app" ref={menuRef}>
                {children}
            </div>
        </React.Fragment>
    );
}
