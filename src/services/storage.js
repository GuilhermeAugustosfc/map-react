export default class LocalStorage{

    static setStorage(data){
        localStorage.setItem(btoa('dataUser'), btoa(JSON.stringify(({
            token: data.token,
            id_indice:data.id
        }))));
    }

    static getStorage(){
        if (localStorage.length > 0) {
            let aux = atob(localStorage.getItem(btoa('dataUser')));     
            return JSON.parse(aux);            
        }
        return false;
    }
    
    static clearStorage(){
        localStorage.clear();
    }    
}
