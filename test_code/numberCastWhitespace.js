#!/usr/bin/env node

let strings = (" ", "", "    ", "\n", "0", "  0", "0  ");

for each (let item in strings) {
	console.log(`\n${item}`);
}

for each (let item in strings) {
	item = Number(item);
	console.log(`\n${item}`);
}
