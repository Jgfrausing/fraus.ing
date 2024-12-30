import React, { use, useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { TerminalWrapper } from "./TerminalWrapper";

const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminal = useRef<XTerm | undefined>(undefined);
  const fitAddon = useRef<FitAddon>(new FitAddon());
  let wrapper = new TerminalWrapper(terminal);

  useEffect(() => {
    if (terminalRef.current) {
      terminal.current = new XTerm({
        fontFamily: "monospace",
        cursorBlink: true,
        cols: 80,
        rows: 25,

        theme: {
          background: "#1e1e1e",
          foreground: "#ffffff",
        },
      });

      terminal.current.loadAddon(fitAddon.current);
      terminal.current.open(terminalRef.current);

      // Fit the terminal to the container
      fitAddon.current.fit();

      const handleResize = () => {
        let proposedDimensions = fitAddon.current.proposeDimensions();
        terminal.current?.resize(
          proposedDimensions!.cols + 1,
          proposedDimensions!.rows
        );
      };
      handleResize();

      wrapper.start();

      return () => {
        terminal.current?.dispose();
      };
    }
  }, []);

  return <div ref={terminalRef} className="terminal" />;
};

export default Terminal;
