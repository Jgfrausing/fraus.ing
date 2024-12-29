import { Terminal as XTerm } from "xterm";
import { root } from "./TerminalWrapper";
type Context = {
  location: string;
};

type Command = {
  description: string;
  usage: string;
  args: string;
  fn: (context: Context, terminal: XTerm, args?: any) => void;
};

type Commands = {
  [key: string]: Command;
};

const content = {
  "about.md": "/about.md",
  posts: {
    "first-post.md": "/posts/first-post.md",
    "second-post.md": "/posts/second-post.md",
  },
};

const commands: Commands = {
  help: {
    description: "List all available commands",
    usage: "help",
    args: "",
    fn: (context: Context, terminal: XTerm) => {
      const longestCommand = Math.max(
        ...Object.keys(commands).map((command) => command.length)
      );

      const longestArgs = Math.max(
        ...Object.values(commands).map((command) => command.args.length)
      );

      terminal.writeln("Commands:");
      Object.keys(commands).forEach((command) => {
        const { args, description } = commands[command];

        terminal.writeln(
          `  ${command.padEnd(longestCommand + 2)}${args.padEnd(longestArgs + 2)}${description}`
        );
      });
    },
  },
  clear: {
    description: "Clear the terminal",
    usage: "clear",
    args: "",
    fn: (context: Context, terminal: XTerm) => {
      terminal.clear();
    },
  },
  echo: {
    description: "Prints a message to the terminal",
    usage: "echo <message>",
    args: "<message>",
    fn: (context: Context, terminal: XTerm, args: any) =>
      terminal.writeln(args.join(" ")),
  },
  ls: {
    description: "List files and directories",
    usage: "ls",
    args: "",
    fn: (context: Context, terminal: XTerm) => {
      let location: any = content;
      const parts = context.location.split("/");
      for (let i = 1; i < parts.length; i++) {
        location = location[parts[i]];
        if (location === undefined) {
          terminal.writeln("Directory not found");
          return;
        }
      }
      terminal.writeln(Object.keys(location).join(" "));
    },
  },
  tree: {
    description: "Prints a tree of the current directory",
    usage: "tree",
    args: "",
    fn: (context: Context, terminal: XTerm) => {
      // assume empty context.location is src/data/files
      terminal.writeln(".");
      let location: any = content;
      const parts = context.location.split("/");
      for (let i = 1; i < parts.length; i++) {
        location = location[parts[i]];
        if (location === undefined) {
          terminal.writeln("Directory not found");
          return;
        }
      }
      terminal.writeln("├─ " + context.location);
    },
  },
};

const execute = (context: Context, terminal: XTerm, input: string) => {
  const [command, ...args] = input.split(" ");

  if (commands[command]) {
    commands[command].fn(context, terminal, args);
  } else {
    terminal.writeln(`Command not found: ${command}`);
  }
};

export default execute;
