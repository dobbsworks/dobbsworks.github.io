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

            // StorageHandler.wheel.getUser("dobbsworks")
            getUser(username) {
                let list = StorageHelper.getList(name);
                let value = list.find(x => x.username.toLowerCase() === username.toLowerCase());
                return value;
            },
            // StorageHandler.wheel.upsert({username: "dobbsworks", foo: "bar"})
            upsert(record) {
                let list = StorageHelper.getList(name);
                list = list.filter(x => x.username !== record.username);
                list.push(record);
                StorageHelper.setList(name, list);
            },
        };
    },
    set(target, name, value) {
        StorageHelper.setList(name, value);
    }
});