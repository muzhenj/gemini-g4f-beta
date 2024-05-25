import { ProxyAgent } from "undici";

type FileType =
	| "image/png"
	| "image/jpeg"
	| "image/webp"
	| "image/heic"
	| "image/heif"
	| "audio/wav"
	| "audio/mp3"
	| "audio/aiff"
	| "audio/aac"
	| "audio/ogg"
	| "audio/flac"
	| "video/mp4"
	| "video/mpeg"
	| "video/mov"
	| "video/avi"
	| "video/x-flv"
	| "video/mpg"
	| "video/webm"
	| "video/wmv"
	| "video/3gpp";

type RemoteFilePart = { fileData: { mime_type: FileType; fileUri: string } };

type InlineFilePart = { inline_data: { mime_type: FileType; data: string } };

type TextPart = { text: string };

export type Part = TextPart | RemoteFilePart | InlineFilePart;

type Role = "user" | "model";

type SafetyRating = { category: string; probability: string };

export type Message = { parts: Part[]; role: Role };

export type PromptFeedback = {
	blockReason?: string;
	safetyRatings: SafetyRating[];
};

export type Candidate = {
	content: { parts: TextPart[]; role: Role };
	finishReason: string;
	index: number;
	safetyRatings: SafetyRating[];
};

export type GeminiResponse = {
	candidates: Candidate[];
	promptFeedback: PromptFeedback;
};

export enum Command {
	StreamGenerate = "streamGenerateContent",
	Generate = "generateContent",
	Embed = "embedContent",
	Count = "countTokens",
}

/**
 * The body used for the API call to generateContent or streamGenerateContent
 */
type GenerateContentBody = {
	contents: Message[];
	generationConfig: {
		maxOutputTokens: number;
		temperature: number;
		topP: number;
		topK: number;
	};
};

/**
 * The response from the REST API to generateContent or streamGenerateContent
 */
type GenerateContentQueryOutput = {
	candidates: Candidate[];
	promptFeedback: PromptFeedback;
};

/**
 * The body used for the API call for each command
 */
export type QueryBodyMap = {
	[Command.StreamGenerate]: GenerateContentBody;
	[Command.Generate]: GenerateContentBody;
	[Command.Count]: { contents: Message[] };
	[Command.Embed]: { model: string; content: Message };
};

/**
 * The response from the REST API for each command
 */
export type QueryResponseMap = {
	[Command.StreamGenerate]: GenerateContentQueryOutput;
	[Command.Generate]: GenerateContentQueryOutput;
	[Command.Embed]: {
		embedding: { values: number[] };
	};
	[Command.Count]: {
		totalTokens: number;
	};
};

// These types are also directly used, as a string, in the Gemini class static properties
// If you are to change these types, ensure to modify the statics in the Gemini class as well.
export type TextFormat = "text";
export type JSONFormat = "json";
export type Format = TextFormat | JSONFormat;

/**
 * The output format for each command.
 */
export type CommandResponseMap<F extends Format = TextFormat> = {
	[Command.StreamGenerate]: F extends JSONFormat
		? QueryResponseMap[Command.StreamGenerate]
		: string;
	[Command.Generate]: F extends JSONFormat
		? QueryResponseMap[Command.Generate]
		: string;
	[Command.Embed]: number[];
	[Command.Count]: number;
};

export type GeminiOptions = {
	fetch?: typeof fetch;
	apiVersion?: string;
	dispatcher?: ProxyAgent;
};

/**
 * The option format for each command.
 */
export type CommandOptionMap<F extends Format = TextFormat> = {
	[Command.Generate]: {
		temperature: number;
		topP: number;
		topK: number;
		format: F;
		maxOutputTokens: number;
		model: string;
		data: Buffer[];
		messages: ([string, string] | Message)[];
		stream?(stream: CommandResponseMap<F>[Command.StreamGenerate]): void;
	};
	[Command.Embed]: {
		model: string;
	};
	[Command.Count]: {
		model: string;
	};
};

export type FormatType<T> = T extends JSONFormat ? GeminiResponse : string;

export type ChatOptions = {
	messages: [string, string][];
	temperature: number;
	topP: number;
	topK: number;
	model: string;
	maxOutputTokens: number;
};

export type ChatAskOptions<F extends Format = TextFormat> = {
	format: F;
	data: [];
	stream?(stream: CommandResponseMap<F>[Command.StreamGenerate]): void;
};
