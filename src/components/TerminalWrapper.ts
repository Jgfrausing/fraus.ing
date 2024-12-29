import React from "react";
import { Terminal as XTerm } from "xterm";
import execute from "./command";

const ignoreKeys = ["ArrowUp", "ArrowDown", "Tab"];
export const root = "/home/jonatan";
export class TerminalWrapper {
  terminal: React.RefObject<XTerm | undefined>;
  location: string = root;
  input: string = "";
  col: number = 3;
  constructor(terminal: React.RefObject<XTerm | undefined>) {
    this.terminal = terminal;
  }

  prefix() {
    return this.location + " $ ";
  }
  writePrefix() {
    this.input = this.prefix();
    this.col = this.input.length;
    this.writeLn();
  }

  start() {
    this.terminal.current?.writeln("Welcome to My Portfolio Terminal!");
    this.terminal.current?.writeln('Type "help" to see available commands.');
    this.writePrefix();

    this.terminal.current?.onKey(({ key, domEvent }) => {
      this.handleKeyPress(key, domEvent);
    });
  }

  handleKeyPress(key: string, domEvent: KeyboardEvent) {
    if (ignoreKeys.includes(domEvent.key)) return;
    else if (domEvent.key === "Enter") {
      this.enter();
    } else if (domEvent.key === "ArrowLeft") {
      this.left();
    } else if (domEvent.key === "ArrowRight") {
      this.right();
    } else if (domEvent.key === "Backspace") {
      this.backspace();
    } else {
      this.key(key);
    }
  }

  key(text: string) {
    this.input =
      this.input.slice(0, this.col) + text + this.input.slice(this.col);
    this.col = this.col + 1;
    this.writeLn();
  }

  left() {
    if (this.col === this.prefix().length) return;
    this.col = this.col - 1;
    this.terminal.current?.write("\x1b[D");
  }
  right() {
    if (this.col === this.input.length) return;
    this.col = this.col + 1;
    this.terminal.current?.write("\x1b[C");
  }
  backspace() {
    if (this.col === this.prefix().length) return;
    this.col = this.col - 1;
    this.input = this.input.slice(0, this.col);
    this.writeLn();
  }
  enter() {
    this.terminal.current?.writeln("");
    let command = this.input.slice(this.prefix().length);
    execute(
      { location: this.location.substring(root.length) },
      this.terminal.current!,
      command
    );

    this.writePrefix();
  }

  writeLn() {
    this.terminal.current?.write("\x1b[2K\r" + this.input);
    for (let i = this.col; i < this.input.length; i++) {
      this.terminal.current?.write("\x1b[D");
    }
  }
}
