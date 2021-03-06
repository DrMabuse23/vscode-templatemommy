'use strict';
import {InputBoxOptions} from 'vscode/vscode';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
const pascalCase = require('pascal-case');
const noCase = require('no-case');
const urlify = require('urlify').create({addEToUmlauts: true});


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "templatemommy" is now active!');

    const inputOptions: vscode.InputBoxOptions = {
      placeHolder: `enter Module Name please`,
      validateInput: (value) => {
        const start = value[0].match(/[0-9]+/g);
        if (start && start.length) {
          if (start.length) {
            return `A file must Start with a Letter. ${value[0]}`
          }
        }
        return '';
      }
    }
    const root = `${vscode.workspace.rootPath}/src`;
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.mommy', (etc) => {
        console.log(etc);
        const a = etc;
        let folder: string;
        let file: string;
        const handleError = (err) => vscode.window.showErrorMessage(err.message, err);
        vscode.window.showQuickPick([
            'Module'
        ])
        .then((res) => {
            const e = res;
            return vscode.window.showInputBox(inputOptions);
        })
          .then((value) => {
            value = urlify(value);
            folder = noCase(value, null, '-');
            file = pascalCase(value);
            if (value) {
                console.log(pascalCase(value));
                console.log();
            }
            return new Promise((resolve, reject) => fs.mkdir(`${root}/${folder}`, (err) => err ? reject(err) : resolve(file))
            );
        })
        .then((file) => {
            return new Promise((resolve, reject) => fs.writeFile(
                `${root}/${folder}/${file}.ts`,
                `export class ${file} extends Component {} `,
                err => err ? reject(err) : resolve(file)
            ))
        })
        .then(
        res => vscode.window.showInformationMessage(`Module ${file} is created.`),
        handleError
        );
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
