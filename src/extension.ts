// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

class EnhancedLinkProvider implements vscode.DocumentLinkProvider {
	provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.DocumentLink[] {
		const text = document.getText();
		let links: vscode.DocumentLink[] = [];

		const patterns = {
			doi: /\bdoi\s*:\s*10\.\d{4,9}\/[-._;()/:A-Z0-9]+/gi,
			pubmed: /\bpubmed\s*:\s*([0-9]+)/gi,
			pmc: /\bpmc\s*:\s*PMC([0-9]+)/gi,
			arxiv: /\barxiv\s*:\s*(\d{4}\.\d{4,5}(v\d+)?)/gi,
			biorxiv: /\bbiorxiv\s*:\s*(\d{4}\.\d{2}\.\d{2}\.\d+)/gi,
			medrxiv: /\bmedrxiv\s*:\s*(\d{4}\.\d{2}\.\d{2}\.\d+)/gi,
		};

		const addLinksForPattern = (pattern: RegExp, formatUrl: (id: string) => string) => {
			let match;
			while ((match = pattern.exec(text)) !== null) {
				const startPos = document.positionAt(match.index);
				const endPos = document.positionAt(match.index + match[0].length);
				const range = new vscode.Range(startPos, endPos);
				const id = match[1] || match[0].split(':')[1].trim(); // Adjust extraction to handle spaces correctly
				const uri = vscode.Uri.parse(formatUrl(id));
				links.push(new vscode.DocumentLink(range, uri));
			}
		};

		// Implement addLinksForPattern for each pattern
		addLinksForPattern(patterns.doi, id => `https://doi.org/${id}`);
		addLinksForPattern(patterns.pubmed, id => `https://pubmed.ncbi.nlm.nih.gov/${id}/`);
		addLinksForPattern(patterns.pmc, id => `https://www.ncbi.nlm.nih.gov/pmc/articles/PMC${id}/`);
		addLinksForPattern(patterns.arxiv, id => `https://arxiv.org/abs/${id}`);
		addLinksForPattern(patterns.biorxiv, id => `https://www.biorxiv.org/content/${id}`);
		addLinksForPattern(patterns.medrxiv, id => `https://www.medrxiv.org/content/${id}`);

		return links;
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const provider = new EnhancedLinkProvider();

	const disposable1 = vscode.languages.registerDocumentLinkProvider({ scheme: 'file', language: 'markdown' }, provider);
	context.subscriptions.push(disposable1);

	const disposable2 = vscode.languages.registerDocumentLinkProvider({ scheme: 'file', language: 'plaintext' }, provider);
	context.subscriptions.push(disposable2);
}

// This method is called when your extension is deactivated
export function deactivate() {}
