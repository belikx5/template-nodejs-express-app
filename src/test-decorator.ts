// function Component(target: Function) {
// 	console.log(target);
// }
function Component(id: number) {
	console.log('User init');
	return (target: Function) => {
		console.log('User run');
		target.prototype.id = id;
	};
}

function Logger() {
	console.log('Logger init');
	return (target: Function) => {
		console.log('Logger run');
	};
}

function Method(
	target: Object,
	propKey: string,
	propDescriptor: PropertyDescriptor,
) {
	console.log(propKey);
	const oldVal = propDescriptor.value;
	propDescriptor.value = function (...args: any[]) {
		return args[0] * 10;
	};
}

function Prop(target: Object, propKey: string) {
	let value: number;

	const getter = () => {
		console.log(`get ${propKey}`);
		return value;
	};
	const setter = (val: number) => {
		console.log(`set ${propKey}`);
		value = val;
	};

	Object.defineProperty(target, propKey, {
		get: getter,
		set: setter,
	});
}

function Param(target: Object, propKey: string, index: number) {
	console.log(propKey, index);
}

@Logger() //initialized first, but invoked after Component
@Component(1) // initialized last, but innvoked before Logger
export class User {
	@Prop id: number;

	@Method
	updateId(@Param id: number) {
		this.id = id;
		return this.id;
	}
}

console.log(new User().id);
