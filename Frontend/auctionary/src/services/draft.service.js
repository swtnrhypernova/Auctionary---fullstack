const KEY = "item_drafts_v1";

const readAll = () => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const drafts = JSON.parse(raw);
    return Array.isArray(drafts) ? drafts : [];
  } catch {
    return [];
  }
};

const writeAll = (drafts) => {
  localStorage.setItem(KEY, JSON.stringify(drafts));
};

const listDrafts = () => {
  return readAll().sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0));
};

const getDraft = (draft_id) => {
  return readAll().find((d) => String(d.draft_id) === String(draft_id)) || null;
};

const saveDraft = (draft) => {
  const drafts = readAll();

  const now = Date.now();
  const draft_id = draft.draft_id || String(now);

  const cleaned = {
    draft_id,
    name: draft.name || "",
    description: draft.description || "",
    starting_bid: draft.starting_bid ?? "",
    end_date: draft.end_date || "", // yyyy-mm-dd
    created_at: draft.created_at || now,
    updated_at: now,

    category_ids: Array.isArray(draft.category_ids) ? draft.category_ids : [],
  };

  const idx = drafts.findIndex((d) => String(d.draft_id) === String(draft_id));
  if (idx >= 0) drafts[idx] = cleaned;
  else drafts.push(cleaned);

  writeAll(drafts);
  return cleaned;
};

const deleteDraft = (draft_id) => {
  const drafts = readAll().filter(
    (d) => String(d.draft_id) !== String(draft_id)
  );
  writeAll(drafts);
};

export const draftService = {
  listDrafts,
  getDraft,
  saveDraft,
  deleteDraft,
};
