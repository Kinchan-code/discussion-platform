import localforage from "localforage";

const configuredLocalforage = localforage.createInstance({
  name: "discussion-platform-storage",
  storeName: "discussion-platform-store",
  description: "Persistent state for discussion platform",
});

export default configuredLocalforage;
