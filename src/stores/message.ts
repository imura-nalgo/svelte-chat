import { writable } from "svelte/store";

const messageStore = writable<{
  message: string | null,
  type: string | null
}>({
  message: null,
  type: null
});

export default {
  subscribe: messageStore.subscribe,
  set: messageStore.set
};