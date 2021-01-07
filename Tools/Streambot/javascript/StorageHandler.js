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
            deleteUser(username) {
                let list = StorageHelper.getList(name);
                list = list.filter(x => x.username.toLowerCase() !== username.toLowerCase());
                StorageHelper.setList(name, list);
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


function CommandTransfer(user, args) {
    let oldName = args[0];
    let newName = args[1];
    if (!oldName || !newName) {
        return {success: false, message: 'Usage: !transfer oldName newName'};
    }
    oldName = oldName.replace("@","");
    newName = newName.replace("@","");

    let transferred = TransferData(oldName, newName);
    if (transferred.length === 0) {
        return {success: false, message: `No data found to transfer from user "${oldName}"`};
    }
    let transferMessage = transferred.join(", ");
    return {success: true, message: `Transfer complete, the following user data was transferred: ${transferMessage}`};
}

function TransferData(oldName, newName) {
    // list of items that are stored by username
    let transferables = [
        "points", // special case, need to sum instead of overwrite
        "maker",
        "shoutout",
        "wheel",
    ];
    let transferred = [];

    console.log(`TRANSFERING DATA! ${oldName} to ${newName}`);
    for (let transferable of transferables) {
        let store = StorageHandler[transferable];
        let oldValue = store.getUser(oldName);
        let newValue = store.getUser(newName);
        console.log(`Transferring ${transferable}`);
        console.log("Old: ", JSON.stringify(oldValue));
        console.log("New: ", JSON.stringify(newValue));
        if (newValue) {
            // newName already in this store
            if (oldValue) {
                // merge data for some stores
                if (transferable === "points") {
                    newValue.value += oldValue.value;
                    store.upsert(newValue);
                    transferred.push(transferable);
                }
            }
        } else if (oldValue) {
            oldValue.username = newName;
            store.upsert(oldValue);
            transferred.push(transferable);
        } 
        store.deleteUser(oldName);
    }
    console.log(`TRANSFER COMPLETE`);
    return transferred;
}