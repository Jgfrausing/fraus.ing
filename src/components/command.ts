import { Terminal as XTerm } from "xterm";

export const root = "/home/jonatan";
type Context = {
  location: string;
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

type Content = {
  [key: string]: string | Content | undefined;
};

const toPath = (content: Content): string => {
  let path = "";
  while (content?.["."] != null) {
    path = content["."] + "/" + path;
    content = content[".."] as Content;
  }

  return path.substring(0, path.length - 1);
};

const content: Content = (() => {
  let structure: Content = {
    "about.md": "/about.md",
    posts: {
      "first-post.md": "/posts/first-post.md",
      "second-post.md": "/posts/second-post.md",
    },
  };

  const addParent = (
    content: Content,
    self: string,
    parent: Content | undefined
  ) => {
    for (const [key, value] of Object.entries(content)) {
      if (value === undefined || typeof value === "string") {
      } else {
        addParent(value, key, content);
      }
    }
    content["."] = self;
    content[".."] = parent;

    return content;
  };

  structure = addParent(structure, root, undefined);
  return structure;
})();

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
    args: "",
    fn: (context: Context, terminal: XTerm) => {
      let location = navigateTo(context.location);
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
        context.location = toPath(content);
        return context;
      } else if (args.length > 1) {
        terminal.writeln("cd: too many arguments");
      } else {
        const navigate = (location: Content, path: string) => {
          if (path === ".") {
            return location;
          } else if (path === "..") {
            if (
              location[".."] === undefined ||
              typeof location[".."] === "string"
            ) {
              throw new Error("Access denied!");
            }
          }
          let newLocation = location[path];
          if (newLocation === undefined) {
            throw new Error("Directory not found");
          } else return newLocation;
        };

        let location = navigateTo(context.location);
        let parts = args[0].split("/");
        console.log(parts);
        if (parts[0] === "~") {
          location = content;
          parts = parts.slice(1);
        }
        for (let i = 0; i < parts.length; i++) {
          let newlocation = navigate(location, parts[i]);
          if (newlocation === undefined) {
            throw new Error("Directory not found");
          } else if (typeof newlocation === "string") {
            throw new Error("Not a directory");
          } else {
            location = newlocation;
          }
        }
        context.location = toPath(location);
      }
      return context;
    },
  },
  tree: {
    description: "Prints a tree of the current directory",
    usage: "tree",
    args: "",
    fn: (context: Context, terminal: XTerm) => {
      terminal.writeln(context.location);

      let location = navigateTo(context.location);
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

      let location = navigateTo(context.location);
      let file = location[args[0]];
      if (file === undefined) {
        terminal.writeln("open: file not found");
        return context;
      } else if (typeof file === "string") {
        terminal.writeln(file);
        return context;
      } else {
        terminal.writeln("open: not a file");
        return context;
      }
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
const navigateTo = (path: string) => {
  console.log(path);
  let location: Content = content;
  if (path[path.length - 1] === "/") {
    path = path.slice(0, path.length - 1);
  }

  const parts = path.slice(root.length).split("/");
  for (let i = 1; i < parts.length; i++) {
    let part = parts[i];
    const newLocation = location[part];

    if (newLocation === undefined || newLocation === null) {
      throw new Error("Directory not found");
    } else if (typeof newLocation === "string") {
      throw new Error("Not a directory");
    } else {
      location = newLocation;
    }
  }
  return location;
};

export default execute;
