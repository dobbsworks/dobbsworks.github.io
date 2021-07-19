function CounterCommand(input, response) {
    let counters = StorageHandler.counters.values;
    let targetCounter = counters.find(a => a.key.toLowerCase() === input.toLowerCase());
    if (!targetCounter) {
        targetCounter = {key: input.toLowerCase(), value: 1}; // skipping 1 to avoid pluralization problems
    }
    targetCounter.value = +(targetCounter.value) + 1;
    StorageHandler.counters = counters;

    let message = response.replace("$0", targetCounter.value);
    
	return Command(input, () => { return message }, commandPermission.all, commandDisplay.hidden);
}