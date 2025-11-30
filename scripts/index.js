import { isWorldTable, isCompendiumTable, rollTable } from "./table-utils.js";

// ---------------- API ----------------
class AllGoblinsHaveNames {
  /**
   * Перебросить имя и био у всех выделенных токенов
   */
  async rerollSelectedTokens() {
    for (let token of canvas.tokens.controlled) {
      const toRoll = mineForTableStrings(token.document);
      if (!toRoll.nameTableStr && !toRoll.bioTableStr) continue;
      const result = await getNewRolledValues(toRoll);
      await saveRolledValues(token.document, result);
    }
  }

  /**
   * Бросок по строке @UUID[...] -> результат из таблицы
   * @param {string} tableStr
   */
  async rollFromTableString(tableStr) {
    if (!isWorldTable(tableStr) && !isCompendiumTable(tableStr)) {
      return tableStr;
    }
    return isWorldTable(tableStr)
      ? await getRollTableResult(tableStr)
      : await getCompendiumTableResult(tableStr);
  }
}

// ---------------- Helpers ----------------

/** RollTable из @UUID[RollTable.<id>] */
async function getRollTableResult(displayName) {
  const m = displayName.match(/@UUID\[RollTable\.([^\]]+)\]/);
  const tableId = m?.[1];
  if (!tableId) {
    ui.notifications.error(`Не удалось распарсить ${displayName}`);
    return displayName;
  }

  const table = game.tables.get(tableId);
  if (!table) {
    ui.notifications.error(`Не найдена RollTable с id ${tableId}`);
    return displayName;
  }

  return await rollTable(table);
}

/** RollTable из @UUID[Compendium.pkg.collection.RollTable.id] */
async function getCompendiumTableResult(displayName) {
  const m = displayName.match(
    /@UUID\[Compendium\.([^.]+)\.([^.]+)\.RollTable\.([^\]]+)\]/
  );
  if (!m) throw new Error(`Неверный формат: ${displayName}`);

  const packId = `${m[1]}.${m[2]}`;
  const tableId = m[3];

  const pack = game.packs.get(packId);
  if (!pack) throw new Error(`Не найден компендий ${packId}`);

  const table = await pack.getDocument(tableId);
  if (!table) throw new Error(`В ${packId} нет таблицы ${tableId}`);

  return await rollTable(table);
}
/** ---------------- Вытащить строки из токена ---------------- */
function mineForTableStrings(tokenDocument) {
  const displayName = tokenDocument.name?.trim() || "";
  let nameTableStr, bioDataPath, bioTableStr;

  // если имя токена = ссылка на таблицу
  if (isWorldTable(displayName) || isCompendiumTable(displayName)) {
    nameTableStr = displayName;
  }

  const actor = tokenDocument.actor;
  if (actor && !tokenDocument.actorLink) {
    const actorData = actor.system;

    let bio;
    // structure of simple worldbuilding system
    if (actorData.biography) {
      bio = actorData.biography;
      bioDataPath = "system.biography";
    }
    // structure of daggerheart adversary (NPCs)
    else if (actor.type === "adversary" && actorData.description) {
      bio = actorData.description;
      bioDataPath = "system.description";
    }
    // structure of D&D 5e NPCs and PCs
    else if (
      actorData.details &&
      actorData.details.biography &&
      actorData.details.biography.value
    ) {
      bio = actorData.details.biography.value;
      bioDataPath = "data.details.biography.value";
    }

    if (bio) {
      const el = document.createElement("div");
      el.innerHTML = bio;
      // Используем innerText, чтобы найти чистую строку @UUID, игнорируя HTML-теги
      const bioText = el.innerText.trim(); 
      if (isWorldTable(bioText) || isCompendiumTable(bioText)) {
        bioTableStr = bioText;
      }
    }
  }

  return { nameTableStr, bioDataPath, bioTableStr };
}

/** ---------------- Сформировать новые значения ---------------- */
async function getNewRolledValues({ nameTableStr, bioTableStr, bioDataPath }) {
  try {
    const result = { bioDataPath };
    if (nameTableStr) {
      result.name = await game.allGoblinsHaveNames.rollFromTableString(nameTableStr);
    }
    if (bioTableStr) {
      result.bio = await game.allGoblinsHaveNames.rollFromTableString(bioTableStr);
    }
    return result;
  } catch (e) {
    console.warn("[All Goblins Have Names]: " + e.message);
    return {};
  }
}

/** ---------------- Сохранить результат (ИСПРАВЛЕНО) ---------------- */
/**
 * Сохраняет результат броска. Имя токена очищается от HTML, Биография сохраняется 
 * в том виде, в котором она была получена от RollTable (может содержать HTML/изображения).
 */
async function saveRolledValues(tokenDocument, result) {
    // 1. Очищаем имя от HTML-тегов, чтобы в имени токена не было форматирования
    const cleanedName = result?.name 
        ? String(result.name).replace(/<[^>]*>/g, '').trim() 
        : undefined;
    
    // 2. Биография сохраняется как есть (RAW), чтобы сохранить форматирование/изображения
    const rawBio = result?.bio 
        ? String(result.bio) 
        : undefined;

    if (cleanedName) {
        // Сохраняем очищенное имя токена
        await tokenDocument.update({ name: cleanedName });
    }
    
    if (rawBio && result?.bioDataPath && tokenDocument.actor) {
        // Сохраняем био с сохранением HTML-тегов
        await tokenDocument.actor.update({ [result.bioDataPath]: rawBio });
    }
}

/** ---------------- Инициализация ---------------- */
Hooks.once("init", () => {
  game.allGoblinsHaveNames = new AllGoblinsHaveNames();
});

Hooks.on("ready", () => {
  // !!! ИСПРАВЛЕНИЕ ОШИБКИ ПРАВ ДОСТУПА: Выполняем логику только у Мастера (GM)
  if (!game.user.isGM) return; 

  Hooks.on("createToken", async (tokenDocument) => {
    // Игнорируем токены, которые являются ссылками на актеров (например, PC)
    if (tokenDocument.actorLink) return;
    
    const toRoll = mineForTableStrings(tokenDocument);
    if (!toRoll.nameTableStr && !toRoll.bioTableStr) return;

    // очистим имя, чтобы не мигала @UUID строка
    await tokenDocument.update({ name: " " });

    const result = await getNewRolledValues(toRoll);
    await saveRolledValues(tokenDocument, result);
  });
});
