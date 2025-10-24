# 😏All Goblins Have Names ReReborn

Use a table as the display name for a token, so each new token gets a random name.

## How to use it

When I started developing my system, I encountered a problem with the original module All Goblins Have Names, which no longer worked because its creator had stopped supporting it. Then I found the All Goblins Have Names Reborn version, but guess what? Its creator also stopped supporting it. So, I'm creating the new version of this module so everyone can enjoy generating anything they can imagine
And if you combine it with a module with Better Rolltables... man it will be beautiful, i mean RANDOM EVERYTHING.

### Return more than one result for firstname + lastname

When multiple lines are returned from a table, the lines will be joined together with a space. For example, you could have a roll table formula of 1d1, and have two results which are also tables for a firstname and a lastname, both with range 1-1.

![A RollTable that returns multiple lines on the same dice roll, for firstname and lastname]

![A RollTable that returns multiple lines on the same dice roll, for firstname and lastname](./test.webm)

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
