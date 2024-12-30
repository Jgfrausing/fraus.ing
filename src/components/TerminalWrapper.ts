import React from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import execute, { autoComplete, Content, home } from "./command";
import { img, about } from "./about";

class RingBuffer<T> {
  buffer: T[];
  index: number;
  constructor(items: T[] = []) {
    this.buffer = items;
    this.index = 0;
  }
  clear() {
    this.buffer = [];
    this.index = 0;
  }
  empty() {
    return this.buffer.length === 0;
  }

  next() {
    if (this.empty()) return undefined;
    this.index = (this.index + 1) % this.buffer.length;
    return this.buffer[this.index];
  }
}
const ignoreKeys = ["ArrowUp", "ArrowDown"];
export class TerminalWrapper {
  setPath: React.Dispatch<React.SetStateAction<string | undefined>>;
  terminal: React.RefObject<XTerm | undefined>;
  location: Content;
  suggestions: RingBuffer<string>;
  input: string = "";
  col: number = 0;
  constructor(
    terminal: React.RefObject<XTerm | undefined>,
    setPath: React.Dispatch<React.SetStateAction<string | undefined>>
  ) {
    this.location = home;
    this.terminal = terminal;
    this.setPath = setPath;
    this.suggestions = new RingBuffer<string>();
  }

  prefix() {
    return this.location.toPath() + "$ ";
  }

  writePrefix() {
    this.input = this.prefix();
    this.col = this.input.length;
    this.writeLn();
  }

  start() {
    let imgLines = img.split("\n");
    let aboutLines = about.split("\n");
    const diff = imgLines.length - aboutLines.length;
    imgLines = imgLines.slice(diff);

    this.terminal.current?.writeln("");

    let displaySize = window.innerWidth < 730 ? "s" : "l";
    if (displaySize === "l") {
      aboutLines = aboutLines.map((line) => line.padEnd(38, " "));
      for (let i = 0; i < imgLines.length; i++) {
        let line = aboutLines[i] + imgLines[i];
        this.terminal.current?.writeln(line);
      }
    } else {
      for (let i = 0; i < imgLines.length; i++) {
        let line = imgLines[i];
        this.terminal.current?.writeln(line.substring(2, 38));
      }
      let line = aboutLines
        .map((line) => line.trim())
        .join(" ")
        .trim();
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
    } else if (domEvent.key === "Tab") {
      this.autoComplete();
      return;
    } else {
      this.key(key);
    }
    this.suggestions.clear();
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
  autoComplete() {
    if (this.suggestions.empty()) {
      let command = this.input.slice(this.prefix().length);
      this.suggestions = new RingBuffer<string>(
        autoComplete({ location: this.location }, command)
      );
    }
    let next = this.suggestions.next();
    if (next === undefined) {
      return;
    }
    this.input = this.prefix() + next;
    this.col = this.input.length;
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

    this.setPath(context.openFile);

    this.writePrefix();
  }

  writeLn() {
    this.terminal.current?.write("\x1b[2K\r" + this.input);
    for (let i = this.col; i < this.input.length; i++) {
      this.terminal.current?.write("\x1b[D");
    }
  }
}
