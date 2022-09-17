export class HTTPError extends Error {
	code: number;
	msg: string;
	context?: string;
	constructor(code: number, msg: string, context?: string) {
		super(msg);
		this.code = code;
		this.msg = msg;
		this.context = context;
	}
}
