import { Terminal as XTerm } from "xterm";

const root = "/home/jonatan";
export type Context = {
  location: Content;
  openFile?: string;
};

type Command = {
  description: string;
  usage: string;
  args: string;
  fn: (context: Context, terminal: XTerm, args?: string[]) => Context;
};

type Commands = {
  [key: string]: Command;
};

type Inner = { [key: string]: string | Inner | undefined };
export class Content {
  inner: Inner;

  constructor(content: Inner) {
    this.inner = this.addParent(content);
  }
  setInner(newlocation: Inner) {
    this.inner = newlocation;
  }
  private addParent(folder: Inner) {
    const recursive = (folder: Inner, name: string, parent?: Inner) => {
      Object.entries(folder).forEach(([key, value]) => {
        if (value !== undefined && typeof value !== "string") {
          value = recursive(value, key, folder);
        }
      });
      folder["."] = name;
      folder[".."] = parent;

      return folder;
    };
    return recursive(folder, root);
  }

  toPath(): string {
    let path = "";

    let inner: Inner | undefined | string = this.inner;
    while (typeof inner !== "string" && inner?.[".."] != undefined) {
      path = inner["."] + "/" + path;
      inner = inner[".."];
    }

    // remove trailing slash
    const pwd = root + "/" + path;
    return pwd.substring(0, pwd.length - 1);
  }

  navigate(path: string): Inner {
    if (path === ".") {
      return this.inner;
    } else if (path === "..") {
      if (
        this.inner[".."] === undefined ||
        typeof this.inner[".."] === "string"
      ) {
        throw new Error("Access denied!");
      }
    }
    let newLocation = this.inner[path];
    if (newLocation === undefined) {
      throw new Error("Directory not found");
    } else if (typeof newLocation === "string") {
      throw new Error("Not a directory");
    } else {
      return newLocation;
    }
  }

  getFilePath(arg: string): string {
    let parts = arg.split("/");
    let file = parts[parts.length - 1];
    parts = parts.slice(0, parts.length - 1);
    console.log(parts);
    let inner = this.inner;
    if (parts.length !== 0) {
      inner = this.navigate(parts.join("/"));
    }
    if (inner[file] === undefined) {
      throw new Error("File not found");
    } else if (typeof inner[file] !== "string") {
      throw new Error("Not a file");
    } else {
      return inner[file];
    }
  }

  keys(): string[] {
    return Object.keys(this.inner).sort();
  }
}

export const home: Content = new Content({
  "about.md": "/about.md",
  posts: {
    "first-post.md": "/posts/first-post.md",
    "second-post.md": "/posts/second-post.md",
  },
});

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
      return context;
    },
  },
  pwd: {
    description: "Print the current working directory",
    usage: "pwd",
    args: "",
    fn: (context: Context, terminal: XTerm) => {
      terminal.writeln(context.location.toPath());
      return context;
    },
  },
  clear: {
    description: "Clear the terminal",
    usage: "clear",
    args: "",
    fn: (context: Context, terminal: XTerm) => {
      terminal.clear();
      return context;
    },
  },
  echo: {
    description: "Prints a message to the terminal",
    usage: "echo <message>",
    args: "<message>",
    fn: (context: Context, terminal: XTerm, args: any) => {
      terminal.writeln(args.join(" "));
      return context;
    },
  },
  ls: {
    description: "List files and directories",
    usage: "ls",
    args: "<optional path>",
    fn: (context: Context, terminal: XTerm, args?: string[]) => {
      let location = context.location.inner;
      if (args?.[0] !== undefined) {
        location = context.location.navigate(args[0]);
      }
      terminal.writeln(Object.keys(location).sort().join(" "));
      return context;
    },
  },

  cd: {
    description: "Change directory",
    usage: "cd <directory>",
    args: "<directory>",
    fn: (context: Context, terminal: XTerm, args?: string[]) => {
      if (args === undefined || args.length === 0 || args[0].trim() === "") {
        context.location = home;
        return context;
      } else if (args.length > 1) {
        terminal.writeln("cd: too many arguments");
      } else {
        let location = context.location;
        let parts = args[0].split("/");
        if (parts[0] === "~") {
          location = home;
          parts = parts.slice(1);
        }
        for (let i = 0; i < parts.length; i++) {
          let newlocation = location.navigate(parts[i]);
          if (newlocation === undefined) {
            throw new Error("Directory not found");
          } else if (typeof newlocation === "string") {
            throw new Error("Not a directory");
          } else {
            location.setInner(newlocation);
          }
        }
        context.location = location;
      }
      return context;
    },
  },
  tree: {
    description: "Prints a tree of the current directory",
    usage: "tree",
    args: "",
    fn: (context: Context, terminal: XTerm) => {
      terminal.writeln(context.location.toPath());

      let location = context.location;
      const printTree = (content: Content, depth: number) => {
        for (const [key, value] of Object.entries(content)) {
          const prefix = " ".repeat(depth);

          if (key === "." || key === "..") {
            continue;
          } else if (value === undefined) {
            continue;
          } else if (typeof value === "string") {
            terminal.writeln(prefix + key);
          } else {
            terminal.writeln(prefix + key + "/");
            printTree(value, depth + 1);
          }
        }
      };

      printTree(location, 1);
      return context;
    },
  },
  open: {
    description: "Open a file",
    usage: "open <file>",
    args: "<file>",
    fn: (context: Context, terminal: XTerm, args?: string[]) => {
      if (args === undefined || args.length === 0) {
        terminal.writeln("open: missing file operand");
        return context;
      } else if (args.length > 1) {
        terminal.writeln("open: too many arguments");
        return context;
      }

      context.openFile = context.location.getFilePath(args[0]);
      terminal.writeln(`Opening ${context.openFile}`);
      return context;
    },
  },
};

const execute = (context: Context, terminal: XTerm, input: string) => {
  const [command, ...args] = input.trim().split(" ");

  try {
    if (commands[command]) {
      return commands[command].fn(context, terminal, args);
    } else {
      terminal.writeln(`Command not found: ${command}`);
      return context;
    }
  } catch (e: any) {
    const error = `\x1b[31m${e.message}\x1b[0m`;
    terminal.writeln(error);
    return context;
  }
};

export default execute;
