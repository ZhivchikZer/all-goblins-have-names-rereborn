# 😏All Goblins Have Names ReReborn

Use a table as the display name for a token, so each new token gets a random name.

## How to use it

When I started developing my system, I encountered a problem with the original module All Goblins Have Names, which no longer worked because its creator had stopped supporting it. Then I found the All Goblins Have Names Reborn version, but guess what? Its creator also stopped supporting it. So, I'm creating the new version of this module so everyone can enjoy generating anything they can imagine
And if you combine it with a module with Better Rolltables... man it will be beautiful, i mean RANDOM EVERYTHING.

### Return more than one result for firstname + lastname

When multiple lines are returned from a table, the lines will be joined together with a space. For example, you could have a roll table formula of 1d1, and have two results which are also tables for a firstname and a lastname, both with range 1-1.

![test]([[https://user-images.githubusercontent.com/15639841/190035889-65905398-4c9b-4e82-be5b-680c1ef47a16.gif](https://github.com/ZhivchikZer/all-goblins-have-names-rereborn/blob/main/%D0%9F%D0%BE%D1%81%D0%BB%D0%B5%D0%B4%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D1%81%D1%82%D1%8C%2001_2.gif](https://raw.githubusercontent.com/ZhivchikZer/all-goblins-have-names-rereborn/refs/heads/main/%D0%9F%D0%BE%D1%81%D0%BB%D0%B5%D0%B4%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D1%81%D1%82%D1%8C%2001_2.gif)))


## Random biographies with Better Rolltables

Story tables are currently bugged in Better Rolltables. When this changes, we will update this README with instructions on how to randomize biographies.

## API

This module provides a few methods under the `game.allGoblinsHaveNames` namespace for use in macros or other modules.

- `game.allGoblinsHaveNames.rerollSelectedTokens()` - Re-rolls the names of all selected tokens.
- `game.allGoblinsHaveNames.rollFromTableString(tableStr)` - Takes a string like `@RollTable[...` or `@Compendium[...` and returns a random result from that table.

## Installation

You can install this module through the Foundry module UI

## Get help

You can reach me on the Foundry VTT discord as Zhivchik.
