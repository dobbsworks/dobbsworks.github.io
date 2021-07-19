function CounterCommand(input, response) {
	return Command(input, () => { 
        let counters = StorageHandler.counters.values;
        let targetCounter = counters.find(a => a.key.toLowerCase() === input.toLowerCase());
        if (!targetCounter) {
            targetCounter = {key: input.toLowerCase(), value: 1}; // skipping 1 to avoid pluralization problems
            counters.push(targetCounter);
        }
        targetCounter.value = +(targetCounter.value) + 1;
        StorageHandler.counters = counters;
    
        let message = response.replace("$0", targetCounter.value);
        return message 
    }, commandPermission.all, commandDisplay.hidden);
}