import React, { useLayoutEffect } from 'react';
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
import LocalStorage from '../../services/storage'

import MyMQTT from '../../services/mqtt'

import mqttContext from '../../Contexts/mqtt'

import { GoCalendar, GoGrabber, GoFileMedia, GoNote, GoDeviceDesktop } from 'react-icons/go'
import { BiLogOutCircle } from 'react-icons/bi'

import "./Menu.css"

export default function Menu({ children }) {
    const [open, setOpen] = React.useState(false);
    const menuRef = React.useRef(null);


    const mymqtt = React.useRef(null);

    useLayoutEffect(() => {
        mymqtt.current = new MyMQTT();
        mymqtt.current.init();
    }, [])

    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(open);
    };

    function logout() {
        children.props.history.push("/")
        LocalStorage.clearStorage()
    }

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
                <Link to="/painel" className="link-menu">
                    <ListItem button key={'painelOs'}>
                        <ListItemIcon>
                            <GoDeviceDesktop color={'black'} size={25} />
                        </ListItemIcon>
                        <ListItemText primary={'PainelOs'} />
                    </ListItem>
                </Link>
            </List>
            {/* <List>
                <Link to="/" className="link-menu">
                    <ListItem button key={'dashboard'}>
                        <ListItemIcon>
                            <BiMapAlt color={'black'} size={25} />
                        </ListItemIcon>
                        <ListItemText primary={'DASHBOARD'} />
                    </ListItem>
                </Link>
            </List> */}
            {/* <List>
                <Link to="/mapa" className="link-menu">
                    <ListItem button key={'mapa'}>
                        <ListItemIcon>
                            <GoGlobe color={'black'} size={25} />
                        </ListItemIcon>
                        <ListItemText primary={'MAPA'} />
                    </ListItem>
                </Link>
            </List> */}
            <List>
                <Link to="/cadastros/ordemservico" className="link-menu">
                    <ListItem button key={'ordemservico'}>
                        <ListItemIcon>
                            <GoCalendar color={'black'} size={25} />
                        </ListItemIcon>
                        <ListItemText primary={'ORDEM DE SERVIÇO'} />
                    </ListItem>
                </Link>
            </List>
            <List>
                <Link to="/cadastros/talhao" className="link-menu">
                    <ListItem button key={'talhao'}>
                        <ListItemIcon>
                            <GoFileMedia color={'black'} size={25} />
                        </ListItemIcon>
                        <ListItemText primary={'TALHÃO'} />
                    </ListItem>
                </Link>
            </List>
            <List>
                <Link to="/relatorio" className="link-menu">
                    <ListItem button key={'relatorio'}>
                        <ListItemIcon>
                            <GoNote color={'black'} size={25} />
                        </ListItemIcon>
                        <ListItemText primary={'RELATORIO'} />
                    </ListItem>
                </Link>
            </List>
        </div>
    )
    return (
        <React.Fragment key={'left'}>
            <IconButton id="menu-navbar" onClick={toggleDrawer(true)} edge="start" color="inherit" aria-label="menu">
                <GoGrabber />
            </IconButton>

            <IconButton id="logout" onClick={logout} edge="start" color="inherit" aria-label="logout">
                <BiLogOutCircle />
            </IconButton>
            <SwipeableDrawer
                anchor={'left'}
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
            >
                <MenuLateral />
            </SwipeableDrawer>

            <mqttContext.Provider value={{instaceMqtt:mymqtt}}>
                <div className="container-app" ref={menuRef}>
                    {children}
                </div>
            </mqttContext.Provider>
        </React.Fragment>
    );
}
