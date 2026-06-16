const { randomUUID } = require("crypto");
const { supabase, isConfigured } = require("../config/supabase");
const data = require("../data/sampleData");

const table = (name) => {
  if (!data[name]) data[name] = [];
  return data[name];
};

const all = async (name) => {
  if (isConfigured) {
    const { data: rows, error } = await supabase.from(name).select("*");
    if (error) throw error;
    return rows || [];
  }
  return table(name);
};

const insert = async (name, payload) => {
  const row = {
    id: payload.id || randomUUID(),
    ...payload,
    created_at: payload.created_at || new Date().toISOString(),
  };

  if (isConfigured) {
    const { data: inserted, error } = await supabase.from(name).insert(row).select("*").single();
    if (error) throw error;
    return inserted;
  }

  table(name).push(row);
  return row;
};

const update = async (name, id, payload) => {
  const patch = { ...payload, updated_at: payload.updated_at || new Date().toISOString() };

  if (isConfigured) {
    const { data: updated, error } = await supabase.from(name).update(patch).eq("id", id).select("*").single();
    if (error) throw error;
    return updated;
  }

  const rows = table(name);
  const index = rows.findIndex((row) => row.id === id);
  if (index === -1) return null;
  rows[index] = { ...rows[index], ...patch };
  return rows[index];
};

const remove = async (name, id) => {
  if (isConfigured) {
    const { error } = await supabase.from(name).delete().eq("id", id);
    if (error) throw error;
    return true;
  }

  const rows = table(name);
  const index = rows.findIndex((row) => row.id === id);
  if (index >= 0) rows.splice(index, 1);
  return index >= 0;
};

const findById = async (name, id) => (await all(name)).find((row) => row.id === id);
const findOne = async (name, predicate) => (await all(name)).find(predicate);

module.exports = { all, insert, update, remove, findById, findOne, isConfigured };
