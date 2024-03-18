// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

class DoiLinkProvider {
	provideDocumentLinks(document, token) {
		const text = document.getText();
		const doiPattern = /\bdoi:10\.\d{4,9}\/[-._;()/:A-Z0-9]+/gi;
		let links = [];

		let match;
		while ((match = doiPattern.exec(text)) !== null) {
			const startPos = document.positionAt(match.index);
			const endPos = document.positionAt(match.index + match[0].length);
			const range = new vscode.Range(startPos, endPos);
			const uri = vscode.Uri.parse(`https://doi.org/${match[0].substring(4)}`);
			const link = new vscode.DocumentLink(range, uri);
			links.push(link);
		}

		return links;
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "sci-mate" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('sci-mate.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Science Mate!');
	});
	context.subscriptions.push(disposable);

	let provider = new DoiLinkProvider();
	let disposable2 = vscode.languages.registerDocumentLinkProvider({ scheme: 'file', language: 'markdown' }, provider);
	context.subscriptions.push(disposable2);
}

// This method is called when your extension is deactivated
export function deactivate() {}
