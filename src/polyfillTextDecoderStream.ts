// TextDecoderStream Polyfill for Bun.
// https://github.com/oven-sh/bun/issues/5648#issuecomment-1824093837

export class PolyfillTextDecoderStream extends TransformStream<
	Uint8Array,
	string
> {
	readonly encoding: string;
	readonly fatal: boolean;
	readonly ignoreBOM: boolean;

	constructor(
		encoding = "utf-8",
		{
			fatal = false,
			ignoreBOM = false,
		}: ConstructorParameters<typeof TextDecoder>[1] = {}
	) {
		const decoder = new TextDecoder(encoding, { fatal, ignoreBOM });
		super({
			transform(
				chunk: Uint8Array,
				controller: TransformStreamDefaultController<string>
			) {
				const decoded = decoder.decode(chunk);
				if (decoded.length > 0) {
					controller.enqueue(decoded);
				}
			},
			flush(controller: TransformStreamDefaultController<string>) {
				const output = decoder.decode();
				if (output.length > 0) {
					controller.enqueue(output);
				}
			},
		});

		this.encoding = encoding;
		this.fatal = fatal;
		this.ignoreBOM = ignoreBOM;
	}
}
