import React from 'react';
import { store } from 'react-notifications-component';
import mqtt from 'mqtt';

class MyMQTT {
    clientMqtt = null;
    messageMqtt = null;

    setFuctionMessageMqtt(functionMessageMqtt) {
        this.messageMqtt = functionMessageMqtt;
    }

    init() {
        this.clientMqtt = mqtt.connect(process.env.REACT_APP_MQTT_HOSTNAME, {
            username: process.env.REACT_APP_MQTT_USERNAME,
            port: process.env.REACT_APP_MQTT_PORT,
            password: process.env.REACT_APP_MQTT_PASSWORD,
            protocol: 'ws',
            connectTimeout: 4000, // Timeout period
            clientId: 1,
        })

        this.clientMqtt.on('connect', function (e, a, b) {
            console.log('conecotu mqtt');
            this.subscribe('macro');
        });

        this.clientMqtt.on('message', (topic, message) => {
            // message is Buffer
            message = message.toString();
            var macro = {};
            try {
                macro = JSON.parse(message)
            } catch (error) {
                return
            }

            this.messageMqtt(macro);

            this.notificacao(macro);
        })
    }

    desconnect() {
        this.clientMqtt.end();
    }

    notificacao(macro) {
        store.addNotification({
            title: "Notificação!",
            message: this.templateMacro(macro),
            type: "info",
            insert: "bottom",
            container: "bottom-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 5000,
                onScreen: true
            }
        });
    }

    templateMacro(macro) {
        return (
            <div>
                <div><strong>Motorista: </strong>{macro.mac_motorista}</div>
                <div><strong>Ação: </strong>{macro.mac_macro}</div>
                <div> <strong> {macro.dentro_cerca ? "Dentro do talhao!" : "Fora do talhao!"}</strong></div>
            </div>
        )

    }
}

export default MyMQTT;






