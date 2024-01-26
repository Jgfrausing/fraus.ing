# A Journey to Seamless Keyboard Usage

A year ago on one of my late night Youtube marathons, I stumbled upon [a review](https://www.youtube.com/watch?v=NcnMR8D0G5o&ab_channel=BenVallack) of the ortholinear [Planck keyboard](https://blog.zsa.io/2307-goodbye-planck-ez/). I was intrigued. My first thought was that it could not be pragmatic to only use 47 keys. I spend most of my day at a keyboard so after having seen a few videos about the keyboard and the reasoning behind ortholinear, I decided to give it a try. Initially, it was just meant to be a fun experiment and I had a feeling that it was a 50%/50% chance on being a decision I would be happy about. I ended up being obsesed about optimizing every part of the experience. I have heard how good typists forget that they are using a keyboard as the thoughts they have seem to magically appear on the screen without them thinking about how to type them. Myself, on the other hand, have always been terrible at using a keyboard. The main reason is that I did not know how to touch type. Instead I would use a 5 or 6 finger and constantly reajust my hands. In this post I will describe my journey of improving many aspects of how I use a keyboard. I still type slower than many of my collueages, but I have learnt something I never thought I would; I can now type without thinking about it.

## The Shift to Planck Keyboard:

The Planck is a minimalistic, 4-row, 37-keys ortholinear layered keyboard. Ortholinear means that the keys are placed in a grid instead of the traditional staggered layouts, where keys are offset going up and down. This keyboard is layered which means that you can access other symbols by switching layer. This is similar to the keyboards on a smartphone, where symbols have their entirely seperate layer. What these layers do, is up to you.

![planck](planck.png)

When I started using the keyboard, I wasn't expecting the amout of customizing that I would be doing. I started out by trying alternatives to the traditional QWERTY layout. I also experiemented with where to put arrow keys, F-keys, and symbols. Everytime I made a change, I had to start from scratch. The keyboard arrived with symbols for letters and modifiers ect., but no visual aid is available for those other keys. Instead, I had to have a window open on my computer to display where keys were located. Some days I was about to quit, but my stubberness and pride wouldn't allow me to.

With my persistance I eventually found inspiration from Vim for navigation. It started with just the HJKL keys that could be used as arrow keys on another layer. Later came other Vim commands such as W and B to jump words and then even more commands. This was a huge relief. I had been using Vim for a while to do minor file changes, so the basic navigation was already known to me. This meant that I just had to get used to changing a layer instead of entering and exiting text mode. Programmable keyboards have a distinction between holding down a key and tapping it. My F and J keys are both set to switch to the Vim navigation layer when held. It requires a bit of practice to always tap when typing, but eventually it gets easy to distinguise between typing a letter and changing a layer. Similar to F or J, can I enter a visual layer by holding down V or a deletion layer by holding down D. I wont go into all the details of the keyboard layout, but the basic concept of the design is, that I rarely have to make key-combinations of more than two keys - One for changing a layer and another to select something in that layer. That in it self is something that stock keyboards with twich the amount of keys fail to achieve.

## One step further

The setup I now have makes me able to have my wrists just barely touch the table in front of the keyboard, and have my fingers do most of the work. I have bought keycaps without symbols as I no longer need the visual aid. I type faster and more consistently and feel that I can focus more on the task at hand and less on the task of the hands.

However, something more had to be done. I was still reaching for my mouse to do many none-typing related tasks when writing. Open this file, check that thing, do this, do that... Using the mouse is a big setback of all the other advancements. I primarily use VSCode as my IDE. I like that it is light weight and that it has all the extensions and customizability you could imagine. The next step of my journey has been to make VSCode as lean and minimalistic as the keyboard.

Out of the box, VSCode comes with a lot of keybindings. When these are used you don't have to touch the mouse a single time. Everything is accounted for - except how to learn them. The problem, to me, is two-fold; Firstly, there is not good way of learning these. Every time you need to learn a keybinding, you basically have to search for it. There is no feedback to help you gradually learn. Secondly, they are complex, conditional, unintuitive, and unhandy.

WhichKey has solved both sides of this issue in many editors and luckily also in VSCode.
The [WhichKey extension](https://marketplace.visualstudio.com/items?itemName=VSpaceCode.whichkey) provide a common entry point for commands. The entry point is very similar to opening the command-window with `Ctrl+Shift+P`. The place it differs is how commands are available within the command-window. With the original solution, you must search for the command in free text. With WhichKey you instead get a menu.

![Which Key](which-key.png)

This menu is divided into sections for types of tasks. An example from my configuration could be `C+f+f` (`C` being the WhichKey trigger), which lets you search for a file and open it. This is similar to `Ctrl+p`. At first glance, this seems to be an additional key press to do the same. However, what the first `f` does is opening all file-related commands. From here, you can also create a new file, rename a file, etc. `C+tab` goes to the previously opened document, `C+x` opens all text-related commands. All of this is of course customizable and if you forget a command you can press `C+?` which allows you to search for it (and see its keybinding). The idea is to have a single entry for starting commands.

### Transforming VSCode:

WhichKey provides a single entry point to commands. Whenever I encounter an action that requires me to use the mouse, I look for an option in WhichKey. If none is available 9/10 times there is an extension that commands that can be used. These extensions allow me to hide most of the default interface - as I don't need to be able to click them. Before I dive into the extensions, I will cover the changes I have made to the visual layout itself. The principal is simple - remove the clutter. Using VSCode's Zen mode, I now have a very simplistic layout:

- No tabs.
- The sidebar is hidden by default. The sidebar is very difficult to navigate without using the mouse. Hiding it forces usage of the keyboard, if possible.
- The bottom panel is also hidden by default. It contains a terminal tab and a problems tab. In addition, I have also moved the explorer from the sidebar to the panel, as this can be navigated using the keyboard easily.
  - This is mostly to gain an overview of the file structure when I forget.
- The scrollbar minimap is disabled. This is to me just a distraction.

The visual settings to configure Zen mod are:

```
"zenMode.hideLineNumbers": false,
"zenMode.showTabs": "none",
"zenMode.hideStatusBar": true,
"zenMode.hideActivityBar": true,
"zenMode.restore": false,
"zenMode.fullScreen": true,
"zenMode.centerLayout": false,
"zenMode.silentNotifications": false,
"editor.minimap.enabled": false,
"workbench.statusBar.visible": false,
```

All of the above results in _just_ the current code file being visible when I am actually coding. I have easily accessible commands through WhichKey to open the terminal, explorer, and problems tabs too. Below is a screenshot of what is visible 99% of the time.

![Zen Mode](zen.png)

All of this has actually caused me to rotate my primary screen, as I no longer have a need for the width. Text is 125% to make reading a bit easier, while still being able to easily have +80 characters per line.

### Extensions

- [WhichKey](https://marketplace.visualstudio.com/items?itemName=VSpaceCode.whichkey) - the enabler.
- [VSpaceCode](https://marketplace.visualstudio.com/items?itemName=VSpaceCode.vspacecode) - spacemacs-like bindings for Which Key - A nice starting point.
- [Advanced New File](https://marketplace.visualstudio.com/items?itemName=patbenatar.advanced-new-file) - create a new file in a location (instead of creating a new untitled)
- [Better Search](https://marketplace.visualstudio.com/items?itemName=travisthieman.better-search) - search in the solution. Results open as an editor with links to the results. This removes most of the needs for the search sidebar.
- [Fuzzy Search](https://marketplace.visualstudio.com/items?itemName=jacobdufault.fuzzy-search) - Fuzzy search in active file
- [File Browser](https://marketplace.visualstudio.com/items?itemName=bodil.file-browser) - Keyboard-driven file browser.

### Git

Although having used git CLI for most of my git commands, there are some tasks that are simply too anoying to do using the CLI. Recently, I have finally given [lazygit](https://github.com/jesseduffield/lazygit) a fair chance, and I must admit it is awesome. It is a full blown git interface in the terminal. It is keyboard driven and provides an awesome way to partially stage files, resolve merge conflicts, and almost everything else, you'd ever need. This was the final road block I needed to remove in order to be truely mouseless when coding.

### VSCode Vim

An cheaper alternative to buying an expensive programmable keyboard is to use VSCode's Vim extension (many other IDEs also have this available). It provides all the functionallity from Vim, but only from within the editor, ofcourse. I have used it before getting the keyboard and consider giving it a try with the keyboard. There are some limitations, that cannot be handled with the keyboard, as it does not have context of the file. Things like jumping to a line or marking a scope is not possible. Currently, I have commands for those things in WhichKey instead.

## Conclusion

Adopting this setup wasn't without its challenges. The initial weeks (months) with the new keyboard were riddled with typos and slow typing speeds as my fingers adjusted to the new layout. Customizing the keyboard and VSCode was a task of trial and error, balancing functionality with simplicity. But with each passing day, muscle memory kicked in, and the advantages began to outweigh the initial discomfort.

This journey has been more than just about efficiency; it's been a journey of learning and personalization. I strongly recommend others to consider if they are satisfied with the level of attention they have to put into their writing. It is not about a keyboard, a setup, or extensions. When we sit behind the wheels of our car we don't think about how to turn or break. That is something we do on auto pilot which allows us to focus our attention on other aspects. I think that is equally important when we sit at the desk.

And to answer your question; No, I will never get back the hours I have spent customizing my IDE or keyboard. If I had just done my job instead, productivity would have been way higher - but where's the fun in that?
