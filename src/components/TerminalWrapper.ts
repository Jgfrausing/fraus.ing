import React from "react";
import { Terminal as XTerm } from "xterm";
import execute, { Content, home } from "./command";
import { me as img, about } from "./about";

const ignoreKeys = ["ArrowUp", "ArrowDown", "Tab"];
export class TerminalWrapper {
  terminal: React.RefObject<XTerm | undefined>;
  location: Content;
  input: string = "";
  col: number = 3;
  constructor(terminal: React.RefObject<XTerm | undefined>) {
    this.location = home;
    this.terminal = terminal;
  }

  prefix() {
    return this.location.toPath() + " $ ";
  }
  writePrefix() {
    this.input = this.prefix();
    this.col = this.input.length;
    this.writeLn();
  }

  start() {
    let imgLines = img.split("\n");
    let aboutLines = about.split("\n").map((line) => line.padEnd(38, " "));
    const diff = imgLines.length - aboutLines.length;
    imgLines = imgLines.slice(diff);

    this.terminal.current?.writeln("");
    for (let i = 0; i < imgLines.length; i++) {
      let line = aboutLines[i] + imgLines[i];
      this.terminal.current?.writeln(line);
    }
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
    let context = execute(
      { location: this.location },
      this.terminal.current!,
      command
    );
    this.location = context.location;

    this.writePrefix();
  }

  writeLn() {
    this.terminal.current?.write("\x1b[2K\r" + this.input);
    for (let i = this.col; i < this.input.length; i++) {
      this.terminal.current?.write("\x1b[D");
    }
  }
}
