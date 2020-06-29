var StorageHelper = {
    getList: (key) => {
        let dataString = localStorage.getItem(key);
        if (!dataString) dataString = "[]";
        return JSON.parse(dataString);
    },
    setList: (key, value) => {
        let dataString = JSON.stringify(value);
        localStorage.setItem(key, dataString);
    }
};

var StorageHandler = new Proxy({}, {
    get(target, name) {
        // requesting StorageHandler.myList will return an 
        // object that allows access to the myList localStorage
        return {
            get values() {
                return StorageHelper.getList(name);
            },
            push(value) {
                let list = StorageHelper.getList(name);
                list.push(value);
                StorageHelper.setList(name, list);
            },
            clear() {
                StorageHelper.setList(name, []);
            },

            //StorageHandler.test1.upsert({foo:3, bar:"D"}, x=>x.foo)
            upsert(value, keyLambda) {
                let list = StorageHelper.getList(name);
                let newList = [];
                for(el of list) {
                    if (keyLambda(el) === keyLambda(value)) newList.push(value);
                    else newList.push(el);
                }
                StorageHelper.setList(name, newList);
            }
        };
    },
    set(target, name, value) {
        StorageHelper.setList(name, value);
    }
});