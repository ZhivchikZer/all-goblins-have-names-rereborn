import {
  isBetterTable,
  isStoryTable,
  rollBetterTable,
  rollStoryTable,
} from "./better-table-util.js";

export function isWorldTable(str) {
  return typeof str === "string" && str.startsWith("@UUID[RollTable");
}

export function isCompendiumTable(str) {
  return typeof str === "string" && str.startsWith("@UUID[Compendium");
}

export async function rollTable(table) {
  // Поддержка Better Rolltables (если модуль активен)
  if (game.modules.get("better-rolltables")?.active) {
    if (isBetterTable(table)) {
      return joinResults(await rollBetterTable(table));
    } else if (isStoryTable(table)) {
      return await rollStoryTable(table); // story возвращает HTML
    }
  }

  // Обычная RollTable
  const draw = await table.draw({ displayChat: false });
  return joinResults(draw.results);
}

/** Склеиваем результаты в одну строку */
function joinResults(results) {
  if (!results) return "";
  return results
    .map(r => r?.text ?? r?.data?.text ?? "")
    .filter(Boolean)
    .join(" ");
}